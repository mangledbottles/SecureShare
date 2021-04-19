#include <iostream>
#include <cstdio>
#include <ctime>

using namespace std;

int main() 
{
    cout << "Screen capture and upload to Mega encrypted storage provider!\n";

    std::time_t timestamp = std::time(0);
    std::string fileName  = std::to_string(timestamp) + ".png";

    std::string directory = "/images/" + fileName;
    
    // cout << directory;

    string command = "cd images && ffmpeg -f x11grab -framerate 1 -video_size 1920x1080 -i :0.0 -vframes 1 " + fileName + " && cd ../";
    char* takeScreenshot = &command[0];

    system(takeScreenshot);


    return 0;
}

