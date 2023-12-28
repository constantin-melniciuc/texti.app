import { Icon } from "@rneui/themed";
import { Link, usePathname } from "expo-router";
import styled from "styled-components/native";
import { colors, theme } from "../../theme";
import { useAuth } from "../../contexts/auth";

const StyledContainer = styled.View`
  align-items: stretch;
  align-content: stretch;
  justify-content: center;
  flex-flow: row nowrap;
  gap: 2px;
  elevation: 4;
`;

const StyledButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: ${theme.spacing.md}px;
  padding-bottom: ${theme.spacing.xs}px;
  border: 0;
  box-shadow: none;
`;

const StyledText = styled.Text<{ isActive: boolean }>`
  font-size: 12px;
  color: ${({ isActive }) => (isActive ? colors.accentBlue : colors.grayText)};
  margin-top: ${theme.spacing.xs / 2}px;
`;

export const BottomNavigation = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isNewChat = pathname === "/chats/new";
  const isChats = pathname.startsWith("/chats") && !isNewChat;
  const { user } = useAuth();

  if (!user) return null;
  return (
    <StyledContainer>
      <Link href="/" asChild>
        <StyledButton>
          <Icon
            size={20}
            name="home"
            color={isHome ? colors.accentBlue : colors.grayText}
          />
          <StyledText isActive={isHome}>Home</StyledText>
        </StyledButton>
      </Link>
      <Link href="/chats/new" asChild>
        <StyledButton>
          <Icon
            size={20}
            name="add-circle"
            color={isNewChat ? colors.accentBlue : colors.grayText}
          />
          <StyledText isActive={isNewChat}>New Chat</StyledText>
        </StyledButton>
      </Link>
      <Link href="/chats" asChild>
        <StyledButton>
          <Icon
            size={20}
            name="forum"
            color={isChats ? colors.accentBlue : colors.grayText}
          />
          <StyledText isActive={isChats}>Chats</StyledText>
        </StyledButton>
      </Link>
    </StyledContainer>
  );
};
