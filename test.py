points = 0

markers = [10, 20, 50, 80]

hit = 55

furthestDiff = 100 - hit
closestMark = 0

if hit > furthestDiff:
	furthestDiff = hit

for mark in markers:
	diff = abs(hit - mark)

	if diff < sensibilityMax:
		points++
		return "Nice"

	if diff <= furthestDiff:
		furthestDiff = diff
		closestMark = mark
		
points--
if hit - closestMark <= 0:
	return "Too Late"
else:
	return "Too Early"