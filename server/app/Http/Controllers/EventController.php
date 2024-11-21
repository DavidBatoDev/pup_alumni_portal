<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\AlumniEvent;
use App\Models\EventPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\EventCreated;
use App\Models\Notification;
use App\Models\Alumni;
use App\Models\AlumniNotification;

class EventController extends Controller
{
    /**
     * Create a new event (Admin only).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    // public function createEvent(Request $request)
    // {
    //     // Validate the input data and the image files
    //     $validatedData = $request->validate([
    //         'event_name' => 'required|string|max:255',
    //         'event_date' => 'required|date',
    //         'location' => 'required|string|max:255',
    //         'type' => 'required|string|max:100',
    //         'category' => 'required|string|max:100',
    //         'organization' => 'nullable|string|max:100',
    //         'description' => 'nullable|string',
    //         'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20048', // Validate multiple images
    //     ]);
    
    //     // Create the event
    //     $event = Event::create($validatedData);
    
    //     // Handle file uploads
    //     if ($request->hasFile('photos')) {
    //         foreach ($request->file('photos') as $photo) {
    //             $path = $photo->store('event_photos', 'public'); // Store in the 'public' disk
    
    //             // Save the photo path in the event_photos table
    //             EventPhoto::create([
    //                 'event_id' => $event->event_id,
    //                 'photo_path' => $path,
    //             ]);
    //         }
    //     }

    //     // broadcast(new EventCreated($event))->toOthers();
    //     // event(new EventCreated($event));

    
    //     return response()->json(['success' => true, 'event' => $event], 201);
    // }
    public function createEvent(Request $request)
    {
        // Validate the input data and the image files
        $validatedData = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'organization' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20048', // Validate multiple images
        ]);

        try {
            // Create the event
            $event = Event::create($validatedData);

            // Handle file uploads
            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $path = $photo->store('event_photos', 'public'); // Store in the 'public' disk

                    // Save the photo path in the event_photos table
                    EventPhoto::create([
                        'event_id' => $event->event_id,
                        'photo_path' => $path,
                    ]);
                }
            }

            // Create a notification for the event
            $notification = Notification::create([
                'type' => 'eventInvitation',
                'alert' => 'New Event Created',
                'title' => $validatedData['event_name'],
                'message' => 'You are invited to the event: ' . $validatedData['event_name'] . ' on ' . $validatedData['event_date'] . ' at ' . $validatedData['location'],
                'link' => '/events/' . $event->event_id, // Link to the event details
            ]);

            // Fetch all alumni IDs
            $alumniIds = Alumni::pluck('alumni_id');

            // Attach the notification to all alumni
            foreach ($alumniIds as $alumniId) {
                AlumniNotification::create([
                    'alumni_id' => $alumniId,
                    'notification_id' => $notification->notification_id,
                    'is_read' => false,
                ]);
            }

            broadcast(new EventCreated($notification, $event))->toOthers();

            return response()->json(['success' => true, 'event' => $event], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    
    /**
     * Update an existing event.
     *
     * @param Request $request
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateEvent(Request $request, $eventId)
    {
        $validatedData = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'organization' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'photos.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20048',
            'existing_photos' => 'nullable|array', // Photos to keep
            'photos_to_delete' => 'nullable|array', // Photos to delete
        ]);
    
        $event = Event::find($eventId);
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
    
        $event->update($validatedData);
    
        // Handle existing photos (deletion)
        if ($request->has('photos_to_delete')) {
            $photosToDelete = $request->input('photos_to_delete');
            foreach ($photosToDelete as $photoId) {
                $photo = EventPhoto::find($photoId);
                if ($photo) {
                    // Delete the photo from storage
                    \Storage::disk('public')->delete($photo->photo_path);
    
                    // Delete the record from the database
                    $photo->delete();
                }
            }
        }
    
        // Handle new photos if they are uploaded
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('event_photos', 'public');
    
                // Save new photo in the database
                EventPhoto::create([
                    'event_id' => $event->event_id,
                    'photo_path' => $path,
                ]);
            }
        }
    
        return response()->json(['success' => true, 'message' => 'Event updated successfully.', 'event' => $event], 200);
    }
    
    /**
     * Delete an existing event.
     *
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteEvent($eventId)
    {
        // Find the event by ID
        $event = Event::find($eventId);
    
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
    
        // Check if any alumni are registered for this event
        $registeredAlumniCount = $event->alumniEvents()->count();
    
        if ($registeredAlumniCount > 0) {
            return response()->json([
                'error' => 'Cannot delete the event. There are ' . $registeredAlumniCount . ' alumni registered for this event. Please remove or cancel their registrations before deleting the event.'
            ], 400);
        }
    
        // Delete the event if there are no registered alumni
        $event->delete();
    
        return response()->json(['success' => true, 'message' => 'Event deleted successfully.'], 200);
    }


    /**
     * Get all registered alumni for a specific event.
     *
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRegisteredAlumniForEvent($eventId)
    {
        // Check if the event exists
        $event = Event::find($eventId);
    
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
    
        // Get all alumni registered for the specific event along with their details
        $registeredAlumni = AlumniEvent::with(['alumni' => function ($query) {
                // Explicitly select the fields using the correct primary key
                $query->select('alumni_id', 'first_name', 'last_name', 'email', 'phone', 'degree', 'graduation_year');
            }])
            ->where('event_id', $eventId)
            ->get()
            ->map(function ($alumniEvent) {
                // Check if the alumni relationship is properly loaded before accessing its attributes
                if ($alumniEvent->alumni) {
                    return [
                        'alumni_id' => $alumniEvent->alumni->alumni_id,
                        'first_name' => $alumniEvent->alumni->first_name,
                        'last_name' => $alumniEvent->alumni->last_name,
                        'email' => $alumniEvent->alumni->email,
                        'phone' => $alumniEvent->alumni->phone,
                        'degree' => $alumniEvent->alumni->degree,
                        'graduation_year' => $alumniEvent->alumni->graduation_year,
                        'registration_date' => $alumniEvent->registration_date,
                    ];
                }
                return null;
            })->filter(); // Remove any null values in case of missing alumni records
    
        return response()->json(['success' => true, 'registered_alumni' => $registeredAlumni], 200);
    }

    /**
     * Register an alumni for a specific event.
     *
     * @param Request $request
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function registerAlumniToEvent(Request $request, $eventId)
    {
        $alumniId = Auth::id(); // Get the authenticated alumni ID

        // Check if the event exists
        $event = Event::find($eventId);
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        // Check if the alumni is already registered for the event
        $existingRegistration = AlumniEvent::where('event_id', $eventId)
            ->where('alumni_id', $alumniId)
            ->first();

        if ($existingRegistration) {
            return response()->json(['error' => 'You are already registered for this event.'], 400);
        }

        // Register the alumni to the event
        $alumniEvent = AlumniEvent::create([
            'alumni_id' => $alumniId,
            'event_id' => $eventId,
            'registration_date' => now(),
        ]);

        return response()->json(['success' => true, 'registration' => $alumniEvent], 201);
    }

    /**
     * Get the list of events.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEvents()
    {
        // Fetch all events with their associated photos
        $events = Event::with('photos')
            ->where('is_active', true)
            ->orderBy('event_date', 'desc')
            ->get();
    
        // Update photo_path to include the full URL
        $events->transform(function ($event) {
            $event->photos->transform(function ($photo) {
                // Prepend the storage URL to the photo_path
                $photo->photo_path = url('storage/' . $photo->photo_path);
                return $photo;
            });
            return $event;
        });
    
        return response()->json(['success' => true, 'events' => $events], 200);
    }

    public function getInactiveEvents()
    {
        try {
            // Fetch all events with their associated photos
            $events = Event::with(['photos', 'postEventPhotos'])
                ->where('is_active', false)
                ->orderBy('event_date', 'desc')
                ->get();
    
            if ($events->isEmpty()) {
                // Return empty response if no inactive events are found
                return response()->json(['success' => true, 'events' => $events], 200);
            }
    
            // Update photo_path to include the full URL for both photos and postEventPhotos
            $events->transform(function ($event) {
                // Transform regular photos
                $event->photos->transform(function ($photo) {
                    $photo->photo_path = url('storage/' . $photo->photo_path);
                    return $photo;
                });
    
                // Transform post event photos
                $event->postEventPhotos->transform(function ($postPhoto) {
                    $postPhoto->photo_path = url('storage/' . $postPhoto->photo_path);
                    return $postPhoto;
                });
    
                return $event;
            });
    
            return response()->json(['success' => true, 'events' => $events], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
    


    /**
     * Get the details of a specific event.
     *
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEventDetails($eventId)
    {
        // Fetch the event details along with registered alumni and event photos
        $event = Event::with(['alumniEvents.alumni', 'photos'])->find($eventId);
    
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
    
        // Format the response
        $eventDetails = [
            'event_id' => $event->event_id,
            'event_name' => $event->event_name,
            'event_date' => $event->event_date,
            'location' => $event->location,
            'type' => $event->type,
            'category' => $event->category,
            'organization' => $event->organization,
            'description' => $event->description,
            'photos' => $event->photos->map(function ($photo) {
                return [
                    'photo_id' => $photo->photo_id,
                    'photo_path' => url('storage/' . $photo->photo_path), // Return full URL to the image
                ];
            }),
            'post_event_photos' => $event->postEventPhotos->map(function ($postPhoto) {
                return [
                    'photo_id' => $postPhoto->photo_id,
                    'photo_path' => url('storage/' . $postPhoto->photo_path), // Return full URL to the image
                ];
            }),
            'registered_alumni' => $event->alumniEvents->map(function ($alumniEvent) {
                return [
                    'alumni_id' => $alumniEvent->alumni->alumni_id,
                    'first_name' => $alumniEvent->alumni->first_name,
                    'last_name' => $alumniEvent->alumni->last_name,
                    'email' => $alumniEvent->alumni->email,
                ];
            }),
        ];
    
        return response()->json(['success' => true, 'event' => $eventDetails], 200);
    }
    

    public function getEventDetailsWithStatus($eventId)
    {
        // Get the authenticated alumni from the token
        $alumni = auth()->user();
    
        // Check if the alumni is authenticated
        if (!$alumni) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        // Fetch the event details along with registered alumni
        $event = Event::with(['alumniEvents.alumni' => function ($query) {
                $query->select('alumni_id', 'first_name', 'last_name', 'email');
            }])
            ->find($eventId);
    
        // If the event is not found, return a 404 response
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
    
        // Check if the specific alumni is registered for the event
        $isRegistered = $event->alumniEvents->contains('alumni_id', $alumni->alumni_id);
    
        // Format the response to include alumni details
        $eventDetails = [
            'event_id' => $event->event_id,
            'event_name' => $event->event_name,
            'event_date' => $event->event_date,
            'location' => $event->location,
            'type' => $event->type, 
            'category' => $event->category, 
            'organization' => $event->organization, 
            'description' => $event->description,
            'registered_alumni' => $event->alumniEvents->map(function ($alumniEvent) {
                return [
                    'alumni_id' => $alumniEvent->alumni->alumni_id,
                    'first_name' => $alumniEvent->alumni->first_name,
                    'last_name' => $alumniEvent->alumni->last_name,
                    'email' => $alumniEvent->alumni->email,
                ];
            }),
            'is_alumni_registered' => $isRegistered
        ];
    
        return response()->json(['success' => true, 'event' => $eventDetails], 200);
    }


}
