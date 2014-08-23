#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>

int main(int argc, char** argv) {
  if (argc < 3)
    return 1;

  std::ifstream file(argv[1]);

  if (!file.good())
    return 1;

  std::vector<float> verts;
  std::vector<float> normals;
  std::vector<int> indices;

  std::string tmp;

  int vert_count = 0;
  int face_count = 0;

  while (tmp != "end_header") {
    if (tmp.size() >= 7 && tmp.substr(0,7) == "element") {
      std::stringstream ss(tmp);
      ss >> tmp;
      ss >> tmp;
      if (tmp == "vertex") {
        ss >> vert_count;
      } else if (tmp == "face") {
        ss >> face_count;
      }
    }
    std::getline(file, tmp);
  }

  //std::cout << "v: " << vert_count << " f: " << face_count << "\n\n";

  std::cout << argv[2] << " : {\n";
  std::cout << "verts : new Float32Array([\n";
  for (int i = 0; i < vert_count; ++i) {
    std::string line;
    std::getline(file, line);
    std::stringstream ss(line);
    float f;
    for (int i = 0; i < 6; ++i) {
      ss >> f;
      std::cout << f << ",";
    }
      std::cout << "\n";
  }
  std::cout << "]),\n";

  std::cout << "indices : new Uint16Array([\n";
  for (int i = 0; i < face_count; ++i) {
    std::string line;
    std::getline(file, line);
    std::stringstream ss(line);
    int nf = 0;
    ss >> nf;
    if (nf != 3)
      printf("crap!\n");
    for (int i = 0; i < 3; ++i) {
      int idx;
      ss >> idx;
      std::cout << idx << ",";
    }
    std::cout << "\n";
  }
    
  std::cout << "]),\n";
  std::cout << "}\n";

  return 0;
}
