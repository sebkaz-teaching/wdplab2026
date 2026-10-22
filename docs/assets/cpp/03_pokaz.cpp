#include <iostream>

int main()
{
    const int count = 6;
    int charge[count] = {80, 20, 55, 0, 100, 30};
    int total = 0;
    for (int i = 0; i < count; ++i) {
        total += charge[i];
        std::cout << i << ": " << charge[i] << ", total: " << total << '\n';
    }
    double average = static_cast<double>(total) / count;
    std::cout << "Average: " << average << '\n';
    return 0;
}
