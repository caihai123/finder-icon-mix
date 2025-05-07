import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Button,
  Slider,
  Divider,
  ColorPicker,
  Splitter,
  Typography,
  Tooltip,
  theme,
} from "antd";
import { QuestionCircleFilled, GithubOutlined } from "@ant-design/icons";
import finderFolderIcon from "/src/assets/finder-folder-icon.png";
import IconSelect from "/src/components/IconSelect";
import LogoSelect from "/src/components/LogoSelect";
import CustomImg from "/src/components/CustomImg";
import { hexToRgb, rgbToHsl, hslToRgb } from "/src/utils/color-transform";

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

const defaultFolderColorList = [
  "null",
  "#FF675D",
  "#FFD654",
  "#65D76C",
  "#4B96FF",
  "#BF76E5",
  "#A5A4A7",
];

export default function Home() {
  const {
    token: { colorBgContainer, colorTextSecondary, borderRadius, colorBorder },
  } = theme.useToken();
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [folderColor, setFolderColor] = React.useState(null);

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
    image.src = finderFolderIcon;

    image.onload = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空整个画布
      if (folderColor) {
        // 创建一个虚拟 canvas 用于计算颜色
        const virtualCanvas = document.createElement("canvas");
        const virtualCtx = virtualCanvas.getContext("2d");
        if (!virtualCtx) return;
        virtualCanvas.width = canvasWidth;
        virtualCanvas.height = canvasHeight;
        virtualCtx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        const imageData = virtualCtx.getImageData(
          0,
          0,
          canvasWidth,
          canvasHeight
        );
        const data = imageData.data;

        // 以下变换来自chatgpt 某些颜色可能与预期不符 我也不知道咋整
        const [targetHue, targetSat] = rgbToHsl(...hexToRgb(folderColor));
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 10) continue;

          const [_, __, light] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
          const [r, g, b] = hslToRgb(targetHue, targetSat, light);

          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
        ctx.putImageData(imageData, 0, 0);
      } else {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      }
      // 缓存背景图为位图，性能更高
      const background = await createImageBitmap(canvas);
      setBackgroundCache(background);
    };
  }, [folderColor]);

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

  // const updateFounderColor = function (hexColor) {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //   const data = imageData.data;

  //   const [targetHue] = rgbToHsl(...hexToRgb(hexColor));

  //   for (let i = 0; i < data.length; i += 4) {
  //     const alpha = data[i + 3];
  //     if (alpha < 10) continue; // 忽略透明像素

  //     const [, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
  //     const [r, g, b] = hslToRgb(targetHue, s, l);

  //     data[i] = r;
  //     data[i + 1] = g;
  //     data[i + 2] = b;
  //   }

  //   ctx.putImageData(imageData, 0, 0);
  // };

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
        style={{
          paddingInline: "1rem",
          background: colorBgContainer,
        }}
        className="flex items-center justify-between border-b border-gray-200"
      >
        <Title style={{ margin: 0, fontSize: 24 }}>Finder Icon Mix</Title>

        <div className="flex items-center gap-2">
          <Tooltip title={"关于我"} mouseEnterDelay={1}>
            <Button
              type="text"
              icon={<QuestionCircleFilled />}
              onClick={() => navigate("/about")}
              style={{ fontSize: 20 }}
            ></Button>
          </Tooltip>
          <Tooltip title={"GitHub"} mouseEnterDelay={1}>
            <Button
              type="text"
              icon={<GithubOutlined />}
              style={{ fontSize: 20 }}
              onClick={() => window.open('//github.com/caihai123/finder-icon-mix/')}
            ></Button>
          </Tooltip>
        </div>
      </Layout.Header>
      <Layout className="flex-1 overflow-y-auto">
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
                  <div className="grid grid-cols-4 gap-2 ">
                    {defaultFolderColorList.map((color) => (
                      <div
                        key={color}
                        style={{
                          border: `1px solid ${colorBorder}`,
                          borderRadius,
                          background: color,
                        }}
                        className="w-full h-[32px]"
                        onClick={() =>
                          setFolderColor(color === "null" ? null : color)
                        }
                      ></div>
                    ))}
                    <ColorPicker
                      value={folderColor}
                      format="hex"
                      disabledAlpha
                      disabledFormat
                      onChange={(val) => setFolderColor(`#${val.toHex()}`)}
                    />
                  </div>
                </div>

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
                        onChange={(value) => setColor(`#${value.toHex()}`)}
                        format="hex"
                        disabledAlpha
                        disabledFormat
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
}
