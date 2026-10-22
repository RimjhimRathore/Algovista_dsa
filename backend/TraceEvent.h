
#ifndef TRACE_EVENT_H
#define TRACE_EVENT_H

#include <string>
#include <vector>

struct TraceEvent {
    std::string type;
    int index1;
    int index2;
    std::vector<int> array;
};

#endif
