/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: API 연결해야함

// @mui
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// components
import { useSettingsContext } from 'src/components/settings';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { DeptNameState, DeptUrlState, selectedIndexState, userDeptListState } from 'src/utils/atom';
//
import { useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { paths } from 'src/routes/paths';
import { set } from 'nprogress';
import Logo from 'src/components/logo';
import { strlen } from 'stylis';
import { IDeptInfo } from 'src/types/dept';
// ----------------------------------------------------------------------

// const OPTIONS = ['CSEE 뉴턴', '오석관', '산학협력관', '에벤에셀'];

// const COLORS = ['secondary', 'info', 'success'];

const DeptButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  width: 200px;
  justify-content: space-between;
  font-size: 1rem;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
`;

export default function DeptHeaderButton() {
  const settings = useSettingsContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const deptList = useRecoilValue(userDeptListState);

  const setDeptUrl = useSetRecoilState(DeptUrlState);

  const [selectedIndex, setSelectedIndex] = useRecoilState(selectedIndexState);

  const [isOpenList, setOpenList] = useState<null | HTMLElement>(null);

  const [menuOpen, setMenuOpen] = useRecoilState<string | null>(DeptNameState);

  const handleOpen = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setOpenList(null);
  }, []);

  const handleClickListItem = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setOpenList(event.currentTarget);
  }, []);

  const handleGOMain = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      handleClose();
      setMenuOpen('HANSPACE');
      setSelectedIndex(-1);
      window.location.replace(paths.hanspace.root);
    },
    [handleClose, setMenuOpen, setSelectedIndex]
  );

  const handleMenuItemClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, option: IDeptInfo) => {
      setSelectedIndex(deptList?.findIndex((dept) => dept.deptId === option.deptId));
      setDeptUrl(option?.deptName);
      setMenuOpen(option?.deptName);
      handleClose();
      window.location.href = paths.dept.dashboard(option?.deptName ?? 'HANSPACE');
    },
    [handleClose, setDeptUrl, setSelectedIndex, setMenuOpen, deptList]
  );

  const handleGOAddDept = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      handleClose();
      setMenuOpen('HANSPACE');
      window.location.replace(paths.hanspace.dept);
      setSelectedIndex(-2);
    },
    [handleClose, setMenuOpen, setSelectedIndex]
  );

  return (
    <>
      <List component="nav" aria-label="Device settings">
        <ListItemButton
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          onClick={handleClickListItem}
        >
          <ListItemText
            primary={
              <DeptButton>
                <Rows>
                  {menuOpen === 'HANSPACE' ? (
                    <Logo />
                  ) : (
                    <Avatar
                      alt="A"
                      color="primary.pale"
                      style={{ height: '30px', width: '30px', fontSize: '16px' }}
                    >
                      {/* {deptList[selectedIndex]?.deptName.charAt(0)} */}A
                    </Avatar>
                  )}
                  {menuOpen}
                </Rows>
                <ArrowDropDownIcon />
              </DeptButton>
            }
          />
        </ListItemButton>
      </List>

      <Menu id="lock-menu" anchorEl={isOpenList} onClose={handleClose} open={Boolean(isOpenList)}>
        <MenuItem
          key="HANSPACE"
          selected={selectedIndex === -1}
          onClick={(event) => handleGOMain(event)}
        >
          <DeptButton>
            <Rows>
              <Logo />
              HANSPACE
            </Rows>
          </DeptButton>
        </MenuItem>

        {deptList?.map((option, index) => (
          <MenuItem
            key={option.deptId}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, option)}
          >
            <DeptButton>
              <Rows>
                <Avatar
                  alt="A"
                  color={option.deptName?.charAt(0) === 'A' ? 'primary.pale' : 'info.pale'}
                  style={{ height: '30px', width: '30px', fontSize: '16px' }}
                >
                  {option.deptName?.charAt(0)}
                </Avatar>
                {option.deptName}

                {option.deptMemberResponse[0].deptRole === 'Admin' ? (
                  <Avatar
                    alt="A"
                    color="primary.pale"
                    style={{ height: '30px', width: '30px', fontSize: '16px' }}
                  >
                    A
                  </Avatar>
                ) : null}
              </Rows>
            </DeptButton>
          </MenuItem>
        ))}
        <MenuItem
          key="기관 추가하기"
          selected={selectedIndex === -2}
          onClick={(event) => handleGOAddDept(event)}
        >
          <DeptButton>
            <Rows>
              <Avatar
                alt="+"
                color="primary.pale"
                style={{ height: '30px', width: '30px', fontSize: '16px' }}
              >
                + {/* TODO : 아바타 이후에 수정하기  */}
              </Avatar>
              세 기관 추가하기
            </Rows>
          </DeptButton>
        </MenuItem>
      </Menu>
    </>
  );
}
