<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thread;
use App\Models\Comment;
use App\Models\Tag;
use App\Models\ThreadTag;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\ThreadImage;


class DiscussionController extends Controller
{
    /**
     * Create a new thread.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    // public function createThread(Request $request)
    // {
    //     // Validate request data
    //     $validator = Validator::make($request->all(), [
    //         'title' => 'required|string|max:255',
    //         'description' => 'required|string',
    //         'tags' => 'nullable|array',
    //         'tags.*' => 'string|max:255', // Validate tags as strings
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $validator->errors(),
    //         ], 422);
    //     }

    //     try {
    //         $alumni = Auth::user(); // Get authenticated alumni

    //         // Create the thread
    //         $thread = Thread::create([
    //             'title' => $request->title,
    //             'description' => $request->description,
    //             'author_id' => $alumni->alumni_id,
    //         ]);

    //         // Process tags
    //         if (!empty($request->tags)) {
    //             $tagIds = [];

    //             foreach ($request->tags as $tagName) {
    //                 // Check if the tag already exists
    //                 $tag = Tag::where('name', $tagName)->first();

    //                 if (!$tag) {
    //                     // If the tag doesn't exist, create it
    //                     $tag = Tag::create(['name' => $tagName]);
    //                 }

    //                 // Add the tag ID to the list
    //                 $tagIds[] = $tag->tag_id;
    //             }

    //             // Sync tags to the thread
    //             $thread->tags()->sync($tagIds);
    //         }

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Thread created successfully.',
    //             'data' => $thread->load('tags'),
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to create thread.',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function createThread(Request $request)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255', // Validate tags as strings
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20048', // Validate multiple images
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        try {
            $alumni = Auth::user(); // Get authenticated alumni

            // Create the thread
            $thread = Thread::create([
                'title' => $request->title,
                'description' => $request->description,
                'author_id' => $alumni->alumni_id,
            ]);

            // Process tags
            if (!empty($request->tags)) {
                $tagIds = [];

                foreach ($request->tags as $tagName) {
                    // Check if the tag already exists
                    $tag = Tag::where('name', $tagName)->first();

                    if (!$tag) {
                        // If the tag doesn't exist, create it
                        $tag = Tag::create(['name' => $tagName]);
                    }

                    // Add the tag ID to the list
                    $tagIds[] = $tag->tag_id;
                }

                // Sync tags to the thread
                $thread->tags()->sync($tagIds);
            }

            // Handle image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('thread_images', 'public'); // Store images in the 'public/thread_images' directory

                    // Save the image path in the ThreadImage table
                    ThreadImage::create([
                        'thread_id' => $thread->thread_id,
                        'image_path' => $path,
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Thread created successfully.',
                'data' => $thread->load('tags', 'images'), // Load tags and images relationships for response
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create thread.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Get all threads with tags and comments count.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getThreads()
    {
        try {
            // Get the authenticated user
            $alumni = Auth::user();

            // Fetch threads with tags, comments, author information, images, and vote counts
            $threads = Thread::with(['tags', 'comments', 'author', 'images'])
                ->withCount([
                    'votes as upvotes' => function ($query) {
                        $query->where('vote', 'upvote'); // Count upvotes
                    },
                    'votes as downvotes' => function ($query) {
                        $query->where('vote', 'downvote'); // Count downvotes
                    }
                ])
                ->get();

            // Format the response for each thread
            $formattedThreads = $threads->map(function ($thread) use ($alumni) {
                // Fetch the user vote
                $userVote = $thread->votes()
                    ->where('alumni_id', $alumni->alumni_id)
                    ->first();

                return [
                    'thread_id' => $thread->thread_id,
                    'title' => $thread->title,
                    'description' => $thread->description,
                    'views' => $thread->views,
                    'author' => [
                        'alumni_id' => $thread->author->alumni_id,
                        'name' => $thread->author->first_name . ' ' . $thread->author->last_name,
                        'email' => $thread->author->email,
                        'profile_picture' => $thread->author->profile_picture
                            ? url('storage/' . $thread->author->profile_picture)
                            : null,
                    ],
                    'upvotes' => $thread->upvotes,
                    'downvotes' => $thread->downvotes,
                    'user_vote' => $userVote ? $userVote->vote : null, // 'upvote', 'downvote', or null if no vote
                    'tags' => $thread->tags->map(function ($tag) {
                        return [
                            'tag_id' => $tag->tag_id,
                            'name' => $tag->name,
                        ];
                    }),
                    'images' => $thread->images->map(function ($image) {
                        return [
                            'image_id' => $image->thread_image_id,
                            'image_path' => url('storage/' . $image->image_path), // Return full URL to the image
                        ];
                    }),
                    'comments_count' => $thread->comments->count(), // Count the number of comments
                    'created_at' => $thread->created_at,
                    'updated_at' => $thread->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedThreads,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch threads.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Get a specific thread by ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    // public function getThread($id)
    // {
    //     try {
    //         // Fetch thread with tags, comments, author information, and vote counts
    //         $thread = Thread::with(['tags', 'comments', 'author'])
    //             ->withCount([
    //                 'votes as upvotes' => function ($query) {
    //                     $query->where('vote', 'upvote'); // Count upvotes
    //                 },
    //                 'votes as downvotes' => function ($query) {
    //                     $query->where('vote', 'downvote'); // Count downvotes
    //                 }
    //             ])
    //             ->findOrFail($id);

    //         return response()->json([
    //             'success' => true,
    //             'data' => $thread,
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Thread not found.',
    //             'error' => $e->getMessage(),
    //         ], 404);
    //     }
    // }

    public function getThread($id)
    {
        try {
            // Get the authenticated user
            $alumni = Auth::user();

            // Fetch thread with tags, comments, author information, images, and vote counts
            $thread = Thread::with([
                    'tags',
                    'comments.alumni', // Eager load alumni relationship for comments
                    'author',
                    'images'
                ])
                ->withCount([
                    'votes as upvotes' => function ($query) {
                        $query->where('vote', 'upvote'); // Count upvotes
                    },
                    'votes as downvotes' => function ($query) {
                        $query->where('vote', 'downvote'); // Count downvotes
                    }
                ])
                ->findOrFail($id);

            // Check if the authenticated user has voted on this thread
            $userVote = $thread->votes()
                ->where('alumni_id', $alumni->alumni_id)
                ->first();

            // Format the response
            $threadDetails = [
                'thread_id' => $thread->thread_id,
                'title' => $thread->title,
                'description' => $thread->description,
                'views' => $thread->views,
                'author' => [
                    'alumni_id' => $thread->author->alumni_id,
                    'name' => $thread->author->first_name . ' ' . $thread->author->last_name,
                    'email' => $thread->author->email,
                    'profile_picture' => $thread->author->profile_picture
                        ? url('storage/' . $thread->author->profile_picture)
                        : null,
                ],
                'upvotes' => $thread->upvotes,
                'downvotes' => $thread->downvotes,
                'user_vote' => $userVote ? $userVote->vote : null, // 'upvote', 'downvote', or null if no vote
                'tags' => $thread->tags->map(function ($tag) {
                    return [
                        'tag_id' => $tag->tag_id,
                        'name' => $tag->name,
                    ];
                }),
                'images' => $thread->images->map(function ($image) {
                    return [
                        'image_id' => $image->thread_image_id,
                        'image_path' => url('storage/' . $image->image_path), // Return full URL to the image
                    ];
                }),
                'comments' => $thread->comments->map(function ($comment) {
                    return [
                        'comment_id' => $comment->comment_id,
                        'content' => $comment->content,
                        'author' => [
                            'alumni_id' => $comment->alumni->alumni_id,
                            'name' => $comment->alumni->first_name . ' ' . $comment->alumni->last_name,
                            'email' => $comment->alumni->email,
                            'profile_picture' => $comment->alumni->profile_picture
                                ? url('storage/' . $comment->alumni->profile_picture)
                                : null,
                        ],
                        'parent_comment_id' => $comment->parent_comment_id,
                        'created_at' => $comment->created_at,
                    ];
                }),
                'created_at' => $thread->created_at,
                'updated_at' => $thread->updated_at,
            ];

            return response()->json([
                'success' => true,
                'data' => $threadDetails,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Thread not found.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update a thread.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    // public function updateThread(Request $request, $id)
    // {
    //     // Validate request data
    //     $validator = Validator::make($request->all(), [
    //         'title' => 'sometimes|string|max:255',
    //         'description' => 'sometimes|string',
    //         'tags' => 'nullable|array',
    //         'tags.*' => 'string|max:255', // Validate tags as strings
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => $validator->errors(),
    //         ], 422);
    //     }

    //     try {
    //         $alumni = Auth::user(); // Get authenticated alumni
    //         $thread = Thread::findOrFail($id); // Find the thread

    //         // Check if the authenticated user is the author
    //         if ($thread->author_id !== $alumni->alumni_id) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Unauthorized.',
    //             ], 403);
    //         }

    //         // Update thread title and description
    //         $thread->update($request->only(['title', 'description']));

    //         // Process tags
    //         if (isset($request->tags)) {
    //             $tagIds = []; // Array to store tag IDs

    //             foreach ($request->tags as $tagName) {
    //                 // Check if the tag already exists
    //                 $tag = Tag::where('name', $tagName)->first();

    //                 if (!$tag) {
    //                     // If the tag doesn't exist, create it
    //                     $tag = Tag::create(['name' => $tagName]);
    //                 }

    //                 // Add the tag ID to the array
    //                 $tagIds[] = $tag->tag_id;
    //             }

    //             // Sync the tags with the thread
    //             $thread->tags()->sync($tagIds);
    //         }

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Thread updated successfully.',
    //             'data' => $thread->load('tags'), // Load tags relationship for response
    //         ], 200);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to update thread.',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function updateThread(Request $request, $id)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255', // Validate tags as strings
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20048', // Validate multiple images
            'existing_images' => 'nullable|array', // Images to keep
            'images_to_delete' => 'nullable|array', // Images to delete
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        try {
            $alumni = Auth::user(); // Get authenticated alumni
            $thread = Thread::findOrFail($id); // Find the thread

            // Check if the authenticated user is the author
            if ($thread->author_id !== $alumni->alumni_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.',
                ], 403);
            }

            // Update thread title and description
            $thread->update($request->only(['title', 'description']));

            // Process tags
            if (isset($request->tags)) {
                $tagIds = []; // Array to store tag IDs

                foreach ($request->tags as $tagName) {
                    // Check if the tag already exists
                    $tag = Tag::where('name', $tagName)->first();

                    if (!$tag) {
                        // If the tag doesn't exist, create it
                        $tag = Tag::create(['name' => $tagName]);
                    }

                    // Add the tag ID to the array
                    $tagIds[] = $tag->tag_id;
                }

                // Sync the tags with the thread
                $thread->tags()->sync($tagIds);
            }

            // Handle images to delete
            if ($request->has('images_to_delete')) {
                $imagesToDelete = $request->input('images_to_delete');
                foreach ($imagesToDelete as $imageId) {
                    $image = ThreadImage::find($imageId);
                    if ($image) {
                        // Delete the image from storage
                        \Storage::disk('public')->delete($image->image_path);

                        // Delete the record from the database
                        $image->delete();
                    }
                }
            }

            // Handle new images if they are uploaded
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('thread_images', 'public');

                    // Save the new image in the database
                    ThreadImage::create([
                        'thread_id' => $thread->thread_id,
                        'image_path' => $path,
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Thread updated successfully.',
                'data' => $thread->load('tags', 'images'), // Load tags and images relationships for response
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update thread.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Delete a thread.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteThread($id)
    {
        try {
            $alumni = Auth::user();
            $thread = Thread::findOrFail($id);

            // Check if the authenticated user is the author
            if ($thread->author_id !== $alumni->alumni_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized.',
                ], 403);
            }

            // Check if the thread has any tags
            if ($thread->tags()->exists()) {
                // Get tag IDs associated with the thread
                $tagIds = $thread->tags()->pluck('tags.tag_id')->toArray();

                // Delete the thread
                $thread->delete();

                // Check if any of the tags are no longer associated with other threads
                foreach ($tagIds as $tagId) {
                    $isTagAssociatedWithOtherThreads = \DB::table('thread_tags') // Explicitly reference the correct pivot table
                        ->where('tag_id', $tagId)
                        ->exists();

                    if (!$isTagAssociatedWithOtherThreads) {
                        Tag::find($tagId)->delete(); // Delete tag if not associated with other threads
                    }
                }
            } else {
                // Delete the thread if no tags are associated
                $thread->delete();
            }

            return response()->json([
                "success" => true,
                "message" => "Thread deleted successfully."
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Failed to delete thread.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }




    /**
     * Add a comment to a thread.
     *
     * @param Request $request
     * @param int $threadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function addComment(Request $request, $threadId)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'parent_comment_id' => 'nullable|exists:comments,comment_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        try {
            $alumni = Auth::user();

            $comment = Comment::create([
                'thread_id' => $threadId,
                'alumni_id' => $alumni->alumni_id,
                'content' => $request->content,
                'parent_comment_id' => $request->parent_comment_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Comment added successfully.',
                'data' => $comment,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add comment.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upvote or downvote a thread.
     *
     * @param Request $request
     * @param int $threadId
     * @return \Illuminate\Http\JsonResponse
     */
    public function voteThread(Request $request, $threadId)
    {
        $validator = Validator::make($request->all(), [
            'vote' => 'required|in:upvote,downvote,null',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors(),
            ], 422);
        }

        try {
            $alumni = Auth::user();
            $thread = Thread::findOrFail($threadId);

            if ($request->vote === 'null') {
                // Remove the vote
                $thread->votes()->where('alumni_id', $alumni->alumni_id)->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Vote removed successfully.',
                ], 200);
            }

            // Create or update the vote
            $vote = $thread->votes()->updateOrCreate(
                ['alumni_id' => $alumni->alumni_id],
                ['vote' => $request->vote]
            );

            return response()->json([
                'success' => true,
                'message' => 'Vote cast successfully.',
                'data' => $vote,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cast vote.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
