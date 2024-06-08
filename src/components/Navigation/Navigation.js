import { Anchor, ConfigProvider } from "antd";
import { anchorStyle } from "./navigationStyle";

function Navigation({ setPage }) {
  return (
    <div className="navigation">
      <ConfigProvider
        theme={{
          components: {
            Anchor: {
              linkPaddingBlock: 15,
            },
          },
        }}
      >
        <Anchor
          onClick={(e) => {
            setPage(e.target.innerHTML);
          }}
          style={anchorStyle}
          affix={false}
          direction="horizontal"
          items={[
            {
              key: "search",
              href: "#search",
              title: "Search",
            },
            {
              key: "rated",
              href: "#rated",
              title: "Rated",
            },
          ]}
        />
      </ConfigProvider>
    </div>
  );
}

export default Navigation;
