<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\AlumniEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Create a new event (Admin only).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createEvent(Request $request)
    {
        // Validate the request input including new fields
        $validatedData = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:100', 
            'category' => 'required|string|max:100',
            'organization' => 'nullable|string|max:100', 
            'description' => 'nullable|string',
        ]);
    
        // Create a new event with the validated data
        $event = Event::create($validatedData);
    
        return response()->json(['success' => true, 'event' => $event], 201);
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
        // Validate the input data including new fields
        $validatedData = $request->validate([
            'event_name' => 'required|string|max:255',
            'event_date' => 'required|date',
            'location' => 'required|string|max:255',
            'type' => 'required|string|max:100', 
            'category' => 'required|string|max:100', 
            'organization' => 'nullable|string|max:100', 
            'description' => 'nullable|string',
        ]);
    
        // Find the event by ID
        $event = Event::find($eventId);
    
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
    
        // Update the event details with the validated data
        $event->update($validatedData);
    
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
        // Fetch all events, ordered by the event date
        $events = Event::orderBy('event_date', 'desc')->get();
        return response()->json(['success' => true, 'events' => $events], 200);
    }


    /**
     * Get the details of a specific event.
     *
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEventDetails($eventId)
    {
        // Fetch the event details along with registered alumni, specifying the correct columns
        $event = Event::with(['alumniEvents.alumni' => function ($query) {
                $query->select('alumni_id', 'first_name', 'last_name', 'email');
            }])
            ->find($eventId);
    
        // If the event is not found, return a 404 response
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }
    
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
