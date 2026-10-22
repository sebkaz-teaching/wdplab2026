#include <iostream>
#include <string>
#include <vector>

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
    std::vector<Device> devices;
    Device radio("Radio A");
    radio.setCharge(40);
    devices.push_back(radio);
    devices.push_back(Device("Sensor B"));

    for (const Device& device : devices) {
        std::cout << device.getName() << ": " << device.getCharge()
                  << ", ready: " << device.isReady() << '\n';
    }
    return 0;
}
