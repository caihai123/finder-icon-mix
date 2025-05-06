import React, { useRef, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  Slider,
  Divider,
  ColorPicker,
  Splitter,
  theme,
} from "antd";
import FinderFolderIcon from "./assets/finder-folder-icon.png";
import IconSelect from "/src/components/IconSelect";
import LogoSelect from "/src/components/LogoSelect";
import CustomImg from "/src/components/CustomImg";

const { Title } = Typography;

/**
 * 更新 SVG 配置
 * @param {string} svgString
 * @param {number} width
 * @param {number} height
 * @param {string} color
 * @returns {string}
 */
function updateSvgConfig(svgString, width, height, color) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svg = doc.querySelector("svg");

  if (!svg) return svgString;

  // 设置 svg 属性
  svg.setAttribute("width", `${width}px`);
  svg.setAttribute("height", `${height}px`);
  svg.setAttribute("fill", color);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  // 可选：递归替换子元素的 fill（慎用）
  doc.querySelectorAll("[fill]").forEach((el) => {
    el.setAttribute("fill", color);
  });

  // 序列化回字符串
  return new XMLSerializer().serializeToString(doc);
}

const canvasWidth = 1024;
const canvasHeight = 1024;
const defaultIconSize = 544; // 544 似乎是 Finder 的默认大小
const defaultIconColor = "#3EABE5"; // 这是 Finder 的默认颜色

const App = () => {
  const {
    token: { colorBgContainer, colorTextSecondary },
  } = theme.useToken();
  const canvasRef = useRef(null);

  const [activeIcon, setActiveIcon] = React.useState(null);

  const [x, setX] = React.useState((canvasWidth - defaultIconSize) / 2); // 居中
  const [y, setY] = React.useState(268); // 268 似乎是 Finder 的默认位置
  const [size, setSize] = React.useState(defaultIconSize);
  const [color, setColor] = React.useState(defaultIconColor);

  const [backgroundCache, setBackgroundCache] = React.useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = FinderFolderIcon;

    image.onload = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      // 缓存背景图为位图，性能更高
      const background = await createImageBitmap(canvas);
      setBackgroundCache(background);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (backgroundCache) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundCache, 0, 0, canvas.width, canvas.height);
    }

    if (!activeIcon) return;

    if (activeIcon.type === "text") {
      ctx.font = `${size}px Arial`;
      ctx.fillStyle = color;
      ctx.fillText(activeIcon.text, x, y);
    } else if (activeIcon.type === "image") {
      const image = new Image();
      image.src = activeIcon.src;
      image.onload = () => {
        ctx.drawImage(image, x, y, size, size);
      };
    } else if (activeIcon.type === "icon") {
      const svgUpdated = updateSvgConfig(activeIcon.svg, size, size, color);
      const svgBlob = new Blob([svgUpdated], {
        type: "image/svg+xml",
      });
      const url = URL.createObjectURL(svgBlob);
      const image = new Image();
      image.src = url;
      image.onload = () => {
        ctx.drawImage(image, x, y, size, size);
        URL.revokeObjectURL(url);
      };
    }
  }, [x, y, size, color, activeIcon, backgroundCache]);

  // 下载图片
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "finder-folder-icon.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Layout className="h-screen">
      <Layout.Header
        style={{ paddingInline: "1rem", background: colorBgContainer }}
        className="flex items-center border-b border-gray-200"
      >
        <Title style={{ margin: 0 }}>FinderIconMix</Title>
      </Layout.Header>
      <Layout className="flex-1">
        <Layout.Content style={{ background: colorBgContainer }}>
          <Splitter>
            <Splitter.Panel>
              <div
                className="w-full p-4 h-full overflow-y-auto"
                style={{ background: colorBgContainer }}
              >
                <div>
                  <div
                    className="py-1 text-base"
                    style={{ color: colorTextSecondary }}
                  >
                    自定义文件
                  </div>

                  <CustomImg
                    onChange={(src) => {
                      setActiveIcon({ type: "image", src });
                    }}
                  />
                </div>

                <div className="mt-2">
                  <div
                    className="py-1 text-base"
                    style={{ color: colorTextSecondary }}
                  >
                    常用Logo
                  </div>
                  <LogoSelect
                    onChange={(src) => setActiveIcon({ type: "image", src })}
                  />
                </div>

                <div className="mt-2">
                  <div
                    className="py-1 text-base"
                    style={{ color: colorTextSecondary }}
                  >
                    Apple图标
                  </div>
                  <IconSelect
                    onChange={(svg) => setActiveIcon({ type: "icon", svg })}
                  />
                </div>
              </div>
            </Splitter.Panel>
            <Splitter.Panel defaultSize="40%" min="20%" max="70%">
              <div className="p-4">
                <canvas
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    backgroundImage:
                      "linear-gradient(45deg, #dedcdc 25%, transparent 0, transparent 75%, #dedcdc 0), -webkit-linear-gradient(45deg, #dedcdc 25%, transparent 0, transparent 75%, #dedcdc 0)",
                    backgroundPosition:
                      "0px 0px, calc(16px + 0px) calc(16px + 0px)",
                    backgroundSize: "calc(16px* 2) calc(16px* 2)",
                  }}
                  className="border border-gray-200"
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                />

                <div className="mt-2">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-[40px]">X:</div>
                    <Slider
                      value={x}
                      onChange={(value) => setX(value)}
                      max={canvasWidth}
                      className="flex-1"
                    />
                    <Button
                      size="small"
                      onClick={() => setX(canvasWidth / 2 - size / 2)}
                    >
                      居中
                    </Button>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    <div className="w-[40px]">Y:</div>
                    <Slider
                      value={y}
                      onChange={(value) => setY(value)}
                      max={canvasHeight}
                      className="flex-1"
                    />
                    <Button
                      size="small"
                      onClick={() => setY(canvasHeight / 2 - size / 2)}
                    >
                      居中
                    </Button>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    <div className="w-[40px]">大小:</div>
                    <Slider
                      value={size}
                      onChange={(value) => setSize(value)}
                      max={canvasWidth}
                      className="flex-1"
                    />
                    <Button
                      size="small"
                      onClick={() => setSize(defaultIconSize)}
                    >
                      默认
                    </Button>
                  </div>

                  <div className="flex justify-center items-center gap-2">
                    <div className="w-[40px]">颜色:</div>
                    <div className="flex-1">
                      <ColorPicker
                        value={color}
                        onChange={(value) => setColor(value)}
                      />
                    </div>
                    <Button
                      size="small"
                      onClick={() => setColor(defaultIconColor)}
                    >
                      默认
                    </Button>
                  </div>
                </div>

                <Divider />

                <Button block onClick={handleDownload} type="primary">
                  导出 PNG
                </Button>
              </div>
            </Splitter.Panel>
          </Splitter>
        </Layout.Content>
      </Layout>
      <Layout.Footer className="flex justify-center gap-2 border-t border-gray-200">
        <p className="text-sm text-gray-500">© 2025 FinderIconMix</p>
        <p className="text-sm text-gray-500">Made with ❤️ by caihai</p>
      </Layout.Footer>
    </Layout>
  );
};

export default App;
