#include <iostream>

int main()
{
    int charge = 0;
    std::cout << "Charge (0-100): ";
    if (!(std::cin >> charge)) {
        std::cout << "Invalid input\n";
        return 1;
    }
    if (charge < 0 || charge > 100) {
        std::cout << "Invalid charge\n";
    } else if (charge < 30) {
        std::cout << "Recharge\n";
    } else if (charge < 80) {
        std::cout << "Ready\n";
    } else {
        std::cout << "Full readiness\n";
    }
    return 0;
}
