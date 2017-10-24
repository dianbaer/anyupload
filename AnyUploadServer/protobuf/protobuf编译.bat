C:
cd C:\Users\admin\Desktop\github\FileSystem\trunk\FileSystemServer\protobuf
protoc --java_out=./ UploadFileProto.proto
protoc --java_out=./ LoginProto.proto
protoc --java_out=./ UserFoldProto.proto
protoc --java_out=./ MutliOperateProto.proto
protoc --java_out=./ BoxErrorProto.proto
protoc --java_out=./ BoxInfoProto.proto
pause