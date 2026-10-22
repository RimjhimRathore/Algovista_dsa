
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <cstdlib>
#include <algorithm>

#include "Sorting.h"
#include "Algorithms.h"

using namespace std;

vector<int> parseArray(const string& input) {
    vector<int> arr;
    stringstream ss(input);
    string item;

    while (getline(ss, item, ',')) {
        if (!item.empty()) {
            arr.push_back(atoi(item.c_str()));
        }
    }

    return arr;
}

void printArray(const vector<int>& arr) {
    cout << "[";
    for (int i = 0; i < (int)arr.size(); i++) {
        if (i) cout << ",";
        cout << arr[i];
    }
    cout << "]";
}

void printEvents(const vector<TraceEvent>& events) {
    cout << "[";

    for (int i = 0; i < (int)events.size(); i++) {
        if (i) cout << ",";

        cout << "{\"type\":\"" << events[i].type << "\",";
        cout << "\"index1\":" << events[i].index1 << ",";
        cout << "\"index2\":" << events[i].index2 << ",";
        cout << "\"array\":";
        printArray(events[i].array);
        cout << "}";
    }

    cout << "]";
}

int main(int argc, char* argv[]) {
    if (argc < 4) {
        cout << "{\"error\":\"Missing arguments\"}";
        return 1;
    }

    string category = argv[1];
    string algorithm = argv[2];
    vector<int> arr = parseArray(argv[3]);
    vector<TraceEvent> events;
    int foundIndex = -1;

    if (category == "sort") {
        if (algorithm == "bubble") {
            events = bubbleSort(arr);
        } else if (algorithm == "selection") {
            events = selectionSort(arr);
        } else if (algorithm == "insertion") {
            events = insertionSort(arr);
        } else {
            cout << "{\"error\":\"Unknown sorting algorithm\"}";
            return 1;
        }
    } else if (category == "search") {
        if (argc < 5) {
            cout << "{\"error\":\"Missing search target\"}";
            return 1;
        }

        int target = atoi(argv[4]);

        if (algorithm == "linear") {
            foundIndex = linearSearch(arr, target, events);
        } else if (algorithm == "binary") {
            if (!is_sorted(arr.begin(), arr.end())) {
                cout << "{\"error\":\"Binary search requires a sorted array\"}";
                return 1;
            }

            foundIndex = binarySearch(arr, target, events);
        } else {
            cout << "{\"error\":\"Unknown search algorithm\"}";
            return 1;
        }
    } else if (category == "structure") {
        if (argc < 6) {
            cout << "{\"error\":\"Missing data structure operation\"}";
            return 1;
        }

        string operation = argv[4];
        int value = atoi(argv[5]);

        if (algorithm == "stack") {
            if (operation == "push") {
                arr.push_back(value);
            } else if (operation == "pop") {
                if (!arr.empty()) arr.pop_back();
            }
        } else if (algorithm == "queue") {
            if (operation == "enqueue") {
                arr.push_back(value);
            } else if (operation == "dequeue") {
                if (!arr.empty()) arr.erase(arr.begin());
            }
        } else if (algorithm == "linkedlist") {
            if (operation == "insert") {
                arr.push_back(value);
            } else if (operation == "delete") {
                vector<int>::iterator it =
                    find(arr.begin(), arr.end(), value);

                if (it != arr.end()) arr.erase(it);
            }
        } else {
            cout << "{\"error\":\"Unknown data structure\"}";
            return 1;
        }

        TraceEvent e;
        e.type = operation;
        e.index1 = -1;
        e.index2 = -1;
        e.array = arr;
        events.push_back(e);
    } else {
        cout << "{\"error\":\"Unknown category\"}";
        return 1;
    }

    cout << "{\"events\":";
    printEvents(events);
    cout << ",\"result\":";
    printArray(arr);
    cout << ",\"foundIndex\":" << foundIndex;
    cout << "}" << endl;

    return 0;
}
