
#include "Sorting.h"
#include <algorithm>

using namespace std;

static void record(vector<TraceEvent>& events,
                   const string& type, int i, int j,
                   const vector<int>& arr) {
    TraceEvent e;
    e.type = type;
    e.index1 = i;
    e.index2 = j;
    e.array = arr;
    events.push_back(e);
}

vector<TraceEvent> bubbleSort(vector<int>& arr) {
    vector<TraceEvent> events;
    int n = (int)arr.size();

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            record(events, "compare", j, j + 1, arr);

            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                record(events, "swap", j, j + 1, arr);
            }
        }
    }

    return events;
}

vector<TraceEvent> selectionSort(vector<int>& arr) {
    vector<TraceEvent> events;
    int n = (int)arr.size();

    for (int i = 0; i < n - 1; i++) {
        int minimum = i;

        for (int j = i + 1; j < n; j++) {
            record(events, "compare", minimum, j, arr);

            if (arr[j] < arr[minimum]) {
                minimum = j;
            }
        }

        if (minimum != i) {
            swap(arr[i], arr[minimum]);
            record(events, "swap", i, minimum, arr);
        }
    }

    return events;
}

vector<TraceEvent> insertionSort(vector<int>& arr) {
    vector<TraceEvent> events;
    int n = (int)arr.size();

    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;

        while (j >= 0) {
            record(events, "compare", j, j + 1, arr);

            if (arr[j] <= key) {
                break;
            }

            arr[j + 1] = arr[j];
            record(events, "move", j, j + 1, arr);
            j--;
        }

        arr[j + 1] = key;
        record(events, "insert", j + 1, i, arr);
    }

    return events;
}
