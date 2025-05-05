import { Image } from "antd";

const logoModules = import.meta.glob("/src/assets/logo/*", { eager: true });
const LogoSelect = function ({ onChange }) {
  const logoList = Object.entries(logoModules).map(([path, mod]) => ({
    path,
    module: mod,
  }));
  return (
    <div className="flex flex-wrap gap-2">
      {logoList.map((item) => (
        <div
          key={item.path}
          onClick={() => onChange(item.module.default)}
          className="flex justify-center items-center p-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-blue-500"
        >
          <Image width="84px" src={item.module.default} preview={false} />
        </div>
      ))}
    </div>
  );
};

export default LogoSelect;
