<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thread;
use App\Models\Comment;
use App\Models\Tag;
use App\Models\ThreadTag;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class DiscussionController extends Controller
{
    /**
     * Create a new thread.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createThread(Request $request)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255', // Validate tags as strings
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
    
            return response()->json([
                'success' => true,
                'message' => 'Thread created successfully.',
                'data' => $thread->load('tags'), 
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
            // Fetch threads with tags and comments
            $threads = Thread::with(['tags', 'comments'])
                ->withCount([
                    'votes as upvotes' => function ($query) {
                        $query->where('vote', 'upvote'); // Count upvotes
                    },
                    'votes as downvotes' => function ($query) {
                        $query->where('vote', 'downvote'); // Count downvotes
                    }
                ])
                ->get();
    
            return response()->json([
                'success' => true,
                'data' => $threads,
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
    public function getThread($id)
    {
        try {
            // Fetch thread with tags, comments, and vote counts
            $thread = Thread::with(['tags', 'comments'])
                ->withCount([
                    'votes as upvotes' => function ($query) {
                        $query->where('vote', 'upvote'); // Count upvotes
                    },
                    'votes as downvotes' => function ($query) {
                        $query->where('vote', 'downvote'); // Count downvotes
                    }
                ])
                ->findOrFail($id);
    
            return response()->json([
                'success' => true,
                'data' => $thread,
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
    public function updateThread(Request $request, $id)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255', // Validate tags as strings
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
    
            return response()->json([
                'success' => true,
                'message' => 'Thread updated successfully.',
                'data' => $thread->load('tags'), // Load tags relationship for response
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
