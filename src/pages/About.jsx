import { Typography } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

export default function About() {
  return (
    <div className="flex justify-center">
      <div className="max-w-screen-lg p-4">
        <Title level={2}>🗂️ FinderIconMix 是什么？ </Title>
        <Paragraph>
          FinderIconMix 是一个专为 macOS 用户打造的小工具，让你可以
          <Text strong>自由定制文件夹图标</Text>
          ，就像系统默认的「应用」「文稿」「下载」文件夹一样好看，甚至更炫。
        </Paragraph>
        <Paragraph>
          它的目标是：
          <Text strong>
            让你给每一个Finder文件夹都贴上独一无二的标识，提升效率与美感。
          </Text>
        </Paragraph>
        <Title level={2}>❓ 为什么需要 FinderIconMix？</Title>
        <Paragraph>
          在 macOS中，用户<Text strong>无法直接为普通文件夹设置图标</Text>
          ，只能通过“显示简介”方式替换整个文件夹图标。但问题是：
        </Paragraph>
        <Paragraph>
          <ul>
            <li>
              <Text strong>没有现成的文件夹图标可以用</Text>
              ，特别是带图标的系统风格样式；
            </li>
            <li>系统默认图标风格好看，却没有官方工具能生成同风格图标。</li>
          </ul>
          <Paragraph strong>FinderIconMix 的作用就是解决这个痛点：</Paragraph>
          <ul>
            <li>提供与 mac 默认风格一致的图标叠加效果；</li>
            <li>
              支持 <Text strong>全部常见的 Apple图标类别</Text>
              （通信、天气、地图、设备等），几乎涵盖你想要的所有图标；
            </li>
            <li>还内置了大量常用 Logo（如 Chrome、Safari、社交应用等）</li>
            <li>
              所有生成图标均为
              PNG，可拖拽用于任何文件夹，无需安装软件，离线可用。
            </li>
          </ul>
        </Paragraph>

        <Title level={2}>🛠️ 怎么用？</Title>
        <Paragraph>
          <ol>
            <li>
              <Text strong>上传你要叠加的图标</Text>，或选择下方提供的 Logo 和
              Apple 图标。
            </li>
            <li>
              拖动滑块调整 <Text strong>位置 / 大小 / 颜色</Text>。
            </li>
            <li>点击「保存」导出 PNG 文件。</li>
            <li>将导出的图标设为你文件夹的图标（如下👇）：</li>
          </ol>
        </Paragraph>

        <Title level={2}>📌 如何更换文件夹图标？</Title>
        <Paragraph>
          <ol>
            <li>将图标拷贝到剪贴板。</li>
            <li>打开 Finder，选中你要更换的文件夹。</li>
            <li>右键 →「显示简介」。</li>
            <li>点击左上角的小图标选择粘贴。</li>
          </ol>
          还是不会？
          <Link
            href="https://support.apple.com/zh-cn/guide/mac-help/mchlp2313/mac"
            target="_blank"
          >
            点击这里查看官方教程
          </Link>
        </Paragraph>

        <Title level={2}>❤️ 如果这个工具对你有帮助，欢迎请作者喝一杯 ☕️</Title>
        <div className="flex mt-2">
          <img
            src={`${import.meta.env.BASE_URL}static/reward/wechat.JPG`}
            alt="微信打赏"
            className="w-32 h-auto mx-2 rounded shadow"
          />
          <img
            src={`${import.meta.env.BASE_URL}static/reward/alipay.JPG`}
            alt="支付宝打赏"
            className="w-32 h-auto mx-2 rounded shadow"
          />
        </div>
      </div>
    </div>
  );
}
