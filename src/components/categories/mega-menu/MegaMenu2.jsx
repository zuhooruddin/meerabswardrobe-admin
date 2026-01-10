import BazaarCard from "components/BazaarCard";
import React from "react";
import CategoryMenuItem from "../CategoryMenuItem";
import MegaMenu3 from "./MegaMenu3";
import StyledMegaMenu from "./StyledMegaMenu"; // component interface

const MegaMenu2 = ({ data }) => {
  return (
    <StyledMegaMenu>
      <BazaarCard
        elevation={2}
        sx={{
          ml: "1rem",
          py: "0.5rem",
        }}
      >
        {data?.map((item) => (
          <CategoryMenuItem
            title={item.title}
            href={item.href}
            icon={item.icon}
            caret={!!item.menuData}
            key={item.title}
          >
            {item.menuData && (
              <MegaMenu3 minWidth="560px" data={item.menuData} />
            )}
          </CategoryMenuItem>
        ))}
      </BazaarCard>
    </StyledMegaMenu>
  );
};

export default MegaMenu2;
