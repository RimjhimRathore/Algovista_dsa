
#ifndef ALGORITHMS_H
#define ALGORITHMS_H

#include <vector>
#include <string>
#include "TraceEvent.h"

int linearSearch(const std::vector<int>& arr, int target,
                 std::vector<TraceEvent>& events);

int binarySearch(const std::vector<int>& arr, int target,
                 std::vector<TraceEvent>& events);

#endif
