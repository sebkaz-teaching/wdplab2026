#include <iostream>
#include <iomanip>
#include <string>

int main()
{
    std::string label = "Measurement";
    double value = 0.0;
    const double correction = 0.25;
    std::cout << "Enter a value: ";
    std::cin >> value;
    value += correction;
    std::cout << label << ": " << std::fixed << std::setprecision(2)
              << value << '\n';
    return 0;
}
