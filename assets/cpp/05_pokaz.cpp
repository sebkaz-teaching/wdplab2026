#include <iostream>
#include <string>
#include <vector>

double average(const std::vector<int>& values)
{
    double total = 0.0;
    for (int value : values) {
        total += value;
    }
    return total / values.size();
}

int main()
{
    std::string name = "Station A";
    std::vector<int> readings;
    int value = 0;
    std::cout << "Readings 0-100; -1 ends input:\n";
    while (std::cin >> value && value != -1) {
        if (value >= 0 && value <= 100) {
            readings.push_back(value);
        } else {
            std::cout << "Rejected\n";
        }
    }
    std::cout << name << ", count: " << readings.size() << '\n';
    if (readings.empty()) {
        std::cout << "No readings\n";
    } else {
        std::cout << "Average: " << average(readings) << '\n';
    }
    return 0;
}
