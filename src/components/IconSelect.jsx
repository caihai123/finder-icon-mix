import { useState, useEffect } from "react";
import { Tabs,theme } from "antd";
import styled from "styled-components";

const CustomTabs = styled(Tabs)`
  & .ant-tabs-nav {
    margin: 0;
  }
  & .ant-tabs-content-holder {
    padding: 12px;
    border: 1px solid ${(props) => props.$borderColor};
    border-top: none;
  }
`;

// icons 的 viewBox 是 0 0 width height
// 需要将其转换为 0 0 1000 1000
// 需要将其居中以保证所有图标视觉上统一
function normalizeSvg(svgStr) {
  const viewBoxMatch = svgStr.match(
    /viewBox="0 0 (\d+(\.\d+)?) (\d+(\.\d+)?)"/
  );
  if (!viewBoxMatch) return svgStr;

  const width = parseFloat(viewBoxMatch[1]);
  const height = parseFloat(viewBoxMatch[3]);
  const dx = (1000 - width) / 2;
  const dy = (1000 - height) / 2;

  return svgStr
    .replace(/viewBox="[^"]+"/, `viewBox="0 0 1000 1000"`)
    .replace(/<g>/, `<g transform="translate(${dx}, ${dy})">`);
}

const iconAll = [
  {
    type: "4",
    name: "通信",
    icons: import.meta.glob("/src/assets/mac-icon/4/*", {
      query: "?raw",
    }),
  },
  {
    type: "5",
    name: "天气",
    icons: import.meta.glob("/src/assets/mac-icon/5/*", {
      query: "?raw",
    }),
  },
  {
    type: "6",
    name: "地图",
    icons: import.meta.glob("/src/assets/mac-icon/6/*", {
      query: "?raw",
    }),
  },
  {
    type: "7",
    name: "物体与工具",
    icons: import.meta.glob("/src/assets/mac-icon/7/*", {
      query: "?raw",
    }),
  },
  {
    type: "8",
    name: "设备",
    icons: import.meta.glob("/src/assets/mac-icon/8/*", {
      query: "?raw",
    }),
  },
  {
    type: "9",
    name: "相机与照片",
    icons: import.meta.glob("/src/assets/mac-icon/9/*", {
      query: "?raw",
    }),
  },
  {
    type: "10",
    name: "游戏",
    icons: import.meta.glob("/src/assets/mac-icon/10/*", {
      query: "?raw",
    }),
  },
  {
    type: "11",
    name: "连接状态",
    icons: import.meta.glob("/src/assets/mac-icon/11/*", {
      query: "?raw",
    }),
  },
  {
    type: "12",
    name: "交通",
    icons: import.meta.glob("/src/assets/mac-icon/12/*", {
      query: "?raw",
    }),
  },
  {
    type: "13",
    name: "汽车",
    icons: import.meta.glob("/src/assets/mac-icon/13/*", {
      query: "?raw",
    }),
  },
  {
    type: "14",
    name: "辅助功能",
    icons: import.meta.glob("/src/assets/mac-icon/14/*", {
      query: "?raw",
    }),
  },
  {
    type: "15",
    name: "隐私与安全性",
    icons: import.meta.glob("/src/assets/mac-icon/15/*", {
      query: "?raw",
    }),
  },
  {
    type: "16",
    name: "人",
    icons: import.meta.glob("/src/assets/mac-icon/16/*", {
      query: "?raw",
    }),
  },
  {
    type: "17",
    name: "家庭",
    icons: import.meta.glob("/src/assets/mac-icon/17/*", {
      query: "?raw",
    }),
  },
  {
    type: "18",
    name: "健身",
    icons: import.meta.glob("/src/assets/mac-icon/18/*", {
      query: "?raw",
    }),
  },
  {
    type: "19",
    name: "自然",
    icons: import.meta.glob("/src/assets/mac-icon/19/*", {
      query: "?raw",
    }),
  },
  {
    type: "20",
    name: "编辑",
    icons: import.meta.glob("/src/assets/mac-icon/20/*", {
      query: "?raw",
    }),
  },
  {
    type: "21",
    name: "文本格式化",
    icons: import.meta.glob("/src/assets/mac-icon/21/*", {
      query: "?raw",
    }),
  },
  {
    type: "22",
    name: "媒体",
    icons: import.meta.glob("/src/assets/mac-icon/22/*", {
      query: "?raw",
    }),
  },
  {
    type: "23",
    name: "键盘",
    icons: import.meta.glob("/src/assets/mac-icon/23/*", {
      query: "?raw",
    }),
  },
  {
    type: "24",
    name: "商业",
    icons: import.meta.glob("/src/assets/mac-icon/24/*", {
      query: "?raw",
    }),
  },
  {
    type: "25",
    name: "时间",
    icons: import.meta.glob("/src/assets/mac-icon/25/*", {
      query: "?raw",
    }),
  },
  {
    type: "26",
    name: "健康",
    icons: import.meta.glob("/src/assets/mac-icon/26/*", {
      query: "?raw",
    }),
  },
  {
    type: "27",
    name: "形状",
    icons: import.meta.glob("/src/assets/mac-icon/27/*", {
      query: "?raw",
    }),
  },
  {
    type: "28",
    name: "箭头",
    icons: import.meta.glob("/src/assets/mac-icon/28/*", {
      query: "?raw",
    }),
  },
  {
    type: "29",
    name: "索引",
    icons: import.meta.glob("/src/assets/mac-icon/29/*", {
      query: "?raw",
    }),
  },
  {
    type: "30",
    name: "数学",
    icons: import.meta.glob("/src/assets/mac-icon/30/*", {
      query: "?raw",
    }),
  },
];

const IconList = function ({ iconModules, onChange }) {
  const [iconList, setIconList] = useState([]);

  useEffect(() => {
    const fetchIcons = async (iconModules) => {
      const iconList = await Promise.all(
        Object.entries(iconModules).map(async ([path, mod]) => {
          const svg = await mod();
          return {
            path,
            svg: normalizeSvg(svg.default),
          };
        })
      );
      setIconList(iconList);
    };

    fetchIcons(iconModules);
  }, [iconModules]);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(45px,_1fr))]">
      {iconList.map((icon) => (
        <div
          key={icon.path}
          onClick={() => onChange(icon.svg)}
          dangerouslySetInnerHTML={{ __html: icon.svg }}
          className="flex justify-center items-center p-2 text-xl border border-gray-200 -mt-[1px] -mr-[1px] cursor-pointer hover:bg-gray-100 hover:text-blue-500"
        ></div>
      ))}
    </div>
  );
};

export default function IconSelect({ onChange }) {
  const {
    token: { colorBorderSecondary },
  } = theme.useToken();

  return (
    <CustomTabs
      defaultActiveKey="4"
      type="card"
      items={iconAll.map((item) => ({
        key: item.type,
        label: item.name,
        children: (
          <IconList
            iconModules={item.icons}
            onChange={(svg) => onChange(svg)}
          />
        ),
      }))}
      $borderColor={colorBorderSecondary}
    />
  );
}
