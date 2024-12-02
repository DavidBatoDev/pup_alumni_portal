<!DOCTYPE html>
<html>
<head>
    <title>Event Registration</title>
</head>
<body>
    <h1>You've Successfully Registered for {{ $eventName }}</h1>
    <p><strong>Event Description:</strong></p>
    <p>{!! $eventDescription !!}</p> <!-- Render raw HTML for description -->
    <p><strong>Event Date:</strong> {{ $eventDate }}</p>
    <p><strong>Location:</strong> {{ $eventLocation }}</p>
    <p>We look forward to seeing you at the event!</p>
</body>
</html>
