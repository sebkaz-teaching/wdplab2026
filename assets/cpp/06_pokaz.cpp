#include <iostream>
#include <string>

class Device
{
private:
    std::string name;
    int charge = 0;

public:
    Device(const std::string& initialName)
        : name(initialName)
    {
    }

    std::string getName() const
    {
        return name;
    }

    int getCharge() const
    {
        return charge;
    }

    bool setCharge(int value)
    {
        if (value < 0 || value > 100) {
            return false;
        }
        charge = value;
        return true;
    }

    bool isReady() const
    {
        return charge >= 30;
    }
};

int main()
{
    Device radio("Radio A");
    radio.setCharge(40);
    bool accepted = radio.setCharge(150);
    std::cout << radio.getName() << ": " << radio.getCharge() << '\n';
    std::cout << "Update accepted: " << accepted << '\n';
    std::cout << "Ready: " << radio.isReady() << '\n';
    return 0;
}
