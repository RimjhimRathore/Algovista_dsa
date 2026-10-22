
#include "Algorithms.h"

using namespace std;

static void recordSearch(vector<TraceEvent>& events,
                         int index, const vector<int>& arr) {
    TraceEvent e;
    e.type = "check";
    e.index1 = index;
    e.index2 = index;
    e.array = arr;
    events.push_back(e);
}

int linearSearch(const vector<int>& arr, int target,
                 vector<TraceEvent>& events) {
    for (int i = 0; i < (int)arr.size(); i++) {
        recordSearch(events, i, arr);

        if (arr[i] == target) {
            return i;
        }
    }

    return -1;
}

int binarySearch(const vector<int>& arr, int target,
                 vector<TraceEvent>& events) {
    int left = 0;
    int right = (int)arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        recordSearch(events, mid, arr);

        if (arr[mid] == target) {
            return mid;
        }

        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}
