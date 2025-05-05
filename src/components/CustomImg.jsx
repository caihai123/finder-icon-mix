import { Upload, Image } from "antd";
import { PlusOutlined, CloseCircleOutlined } from "@ant-design/icons";
import useLocalStorageState from "use-local-storage-state";
import { Flipper, Flipped } from "react-flip-toolkit";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // 读取为 Base64
    reader.onload = () => resolve(reader.result); // 成功回调
    reader.onerror = (error) => reject(error); // 错误回调
  });
}

export default function CustomImg({ onChange }) {
  const [fileList, setFileList] = useLocalStorageState("custom-img", {
    defaultValue: [],
  });

  const handleRemove = (uid) => {
    setFileList((prev) => prev.filter((item) => item.uid !== uid));
  };

  return (
    <Flipper
      flipKey={fileList.map((item) => item.uid).join(",")}
      className="flex flex-wrap gap-2"
    >
      {fileList.map((item) => (
        <Flipped key={`${item.uid}`} flipId={`${item.uid}`}>
          <div
            onClick={() => onChange(item.url)}
            className="group relative flex justify-center items-center p-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-500"
          >
            <Image
              width="84px"
              src={item.thumbUrl || item.url}
              preview={false}
            />
            <CloseCircleOutlined
              onClick={(event) => {
                // 阻止事件冒泡
                event.stopPropagation();
                handleRemove(item.uid);
              }}
              className="absolute top-0 right-0 text-lg opacity-0 group-hover:opacity-100 transition"
            />
          </div>
        </Flipped>
      ))}
      <Flipped flipId="upload">
        <div>
          <Upload
            fileList={fileList}
            onChange={({ fileList }) =>
              setFileList(
                fileList.map((item) => ({
                  uid: item.uid,
                  name: item.name,
                  status: item.status,
                  url: item.response || item.url,
                  thumbUrl: item.thumbUrl,
                }))
              )
            }
            listType="picture-card"
            accept="image/*"
            customRequest={(content) => {
              const { file } = content;
              fileToBase64(file).then((base64) => {
                content.onSuccess(base64);
              }).catch((error) => {
                content.onError(error);
              });
            }}
            showUploadList={false}
          >
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </div>
      </Flipped>
    </Flipper>
  );
}
