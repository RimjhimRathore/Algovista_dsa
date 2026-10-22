
#ifndef SORTING_H
#define SORTING_H

#include <vector>
#include "TraceEvent.h"

std::vector<TraceEvent> bubbleSort(std::vector<int>& arr);

std::vector<TraceEvent> selectionSort(std::vector<int>& arr);

std::vector<TraceEvent> insertionSort(std::vector<int>& arr);

#endif
