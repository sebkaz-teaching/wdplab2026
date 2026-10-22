#include <iostream>

bool isReady(int charge)
{
    return charge >= 30 && charge <= 100;
}

int countReady(const int values[], int count)
{
    int ready = 0;
    for (int i = 0; i < count; ++i) {
        if (isReady(values[i])) {
            ++ready;
        }
    }
    return ready;
}

void addCorrection(int& value, int correction)
{
    value += correction;
}

int main()
{
    int charge[4] = {20, 30, 80, 0};
    addCorrection(charge[0], 15);
    std::cout << "First: " << charge[0] << '\n';
    std::cout << "Ready: " << countReady(charge, 4) << '\n';
    return 0;
}
