import { Avatar, Box, useMediaQuery } from "@mui/material";
import { FlexBetween } from "components/flex-box";
import Scrollbar from "components/Scrollbar";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import LayoutDrawer from "../LayoutDrawer";

import {
  BadgeValue,
  BulletIcon,
  ChevronLeftIcon,
  ExternalLink,
  ListIconWrapper,
  ListLabel,
  NavItemButton,
  NavWrapper,
  SidebarWrapper,
  StyledText,
} from "./LayoutStyledComponents";
import { superAdminNavigations,navigations } from "./NavigationList";
import SidebarAccordion from "./SidebarAccordion";
import {useSession} from 'next-auth/react';

const TOP_HEADER_AREA = 70; // -----------------------------------------------------------------------------
import axios from "axios";
import useSWR from "swr";
// -----------------------------------------------------------------------------
const DashboardSidebar = (props) => {
  const {
    sidebarCompact,
    showMobileSideBar,
    setShowMobileSideBar,
    setSidebarCompact,
    
  } = props;



 
  




  const router = useRouter();
  const { data: session,status} = useSession();
  const [onHover, setOnHover] = useState(false);
  const downLg = useMediaQuery((theme) => theme.breakpoints.down("lg")); // side hover when side bar is compacted
  const imageurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE+'media/';

  const COMPACT = sidebarCompact && !onHover ? 1 : 0; // handle active current page

  const activeRoute = (path) => (router.pathname === path ? 1 : 0); // handle navigate to another route and close sidebar drawer in mobile device

  const handleNavigation = (path) => {
    // router.push(path);
    window.location.href = path;
    setShowMobileSideBar();
  };

  const renderLevels = (data) => {
    return data.map((item, index) => {
      if (item.type === "label")
        return (
          <ListLabel key={index} compact={COMPACT}>
            {item.label}
          </ListLabel>
        );

      if (item.children) {
        return (
          <SidebarAccordion key={index} item={item} sidebarCompact={COMPACT}>
            {renderLevels(item.children)}
          </SidebarAccordion>
        );
      } else if (item.type === "extLink") {
        return (
          <ExternalLink
            key={index}
            href={item.path}
            rel="noopener noreferrer"
            target="_blank"
          >
            <NavItemButton key={item.name} name="child" active={0}>
              {item.icon ? (
                <ListIconWrapper>
                  <item.icon />
                </ListIconWrapper>
              ) : (
                <span className="item-icon icon-text">{item.iconText}</span>
              )}

              <StyledText compact={COMPACT}>{item.name}</StyledText>

              {/* <Box mx="auto" /> */}

              {item.badge && (
                <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>
              )}
            </NavItemButton>
          </ExternalLink>
        );
      } else {
        return (
          <Box key={index}>
            <NavItemButton
              key={item.name}
              className="navItem"
              active={activeRoute(item.path)}
              onClick={() => handleNavigation(item.path)}
            >
              {item?.icon ? (
                <ListIconWrapper>
                  <item.icon />
                </ListIconWrapper>
              ) : (
                <BulletIcon active={activeRoute(item.path)} />
              )}

              <StyledText compact={COMPACT}>{item.name}</StyledText>

              {/* <Box mx="auto" /> */}

              {item.badge && (
                <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>
              )}
            </NavItemButton>
          </Box>
        );
      }
    });
  };

  const content = (
    <Scrollbar
      autoHide
      clickOnTrack={false}
      sx={{
        overflowX: "hidden",
        maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
      }}
    >
      <NavWrapper compact={sidebarCompact}>
        {renderLevels(session && 'user' in session && session.user!==undefined?session.user['role']==1?superAdminNavigations:navigations:navigations)}
      </NavWrapper>
    </Scrollbar>
  );

  if (downLg) {
    return (
      <LayoutDrawer open={showMobileSideBar} onClose={setShowMobileSideBar}>
        <Box p={2} maxHeight={TOP_HEADER_AREA}>
          <Image
            alt="Logo"
            width={60}
            height={36}
            // layout="fill"
            src={session && session?imageurl+session.logodata:''}
            style={{
              marginLeft: 8,
            }}
          />
        </Box>

        {content}
      </LayoutDrawer>
    );
  }

  return (
    <SidebarWrapper
      compact={sidebarCompact}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => sidebarCompact && setOnHover(false)}
    >
      <FlexBetween
        p={2}
        maxHeight={TOP_HEADER_AREA}
        justifyContent={COMPACT ? "center" : "space-between"}
      >
        <Avatar
          src={
            COMPACT
              ? session && session?imageurl+session.logodata:''
              : session && session?imageurl+session.logodata:''
          }
          sx={{
            borderRadius: 0,
            width: "auto",
            marginLeft: COMPACT ? 0 : 1,
          }}
        />

        <ChevronLeftIcon
          color="disabled"
          compact={COMPACT}
          onClick={setSidebarCompact}
          sidebarcompact={sidebarCompact ? 1 : 0}
        />
      </FlexBetween>

      {content}
    </SidebarWrapper>
  );
};

export default DashboardSidebar;
