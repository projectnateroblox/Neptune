# Building the api

To build the api run the following command:
```bash
dotnet publish -c Release -r win-x64 --self-contained true -o ./publish
```
after that copy the publish directory to the project directory, make sure to replace the old publish directory with the new publish directory

### Shitty documentation written by me