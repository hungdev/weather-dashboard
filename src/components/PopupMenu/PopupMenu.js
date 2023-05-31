import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import styles from './PopupMenu.module.scss';


const OverflowMenu = forwardRef(({
  renderToggle = <div>Click Here</div>,
  position = 'bottom-left',
  classNames = '',
  children = <></>,
  renderChildren,
  onClickOutside,
  getPosition,
  onToggleMenu,
  visibleMenu = () => { },
}, ref) => {
  const wrapperRef = useRef(null);
  const overflowToggleRef = useRef(null);
  const menuRef = useRef(null);
  const [visible, setVisible] = useState({ show: false, top: 0, left: 0 });

  useImperativeHandle(ref, () => ({
    onClose() {
      setVisible({ show: false, top: 0, left: 0 });
    }
  }));
  useEffect(() => {
    visibleMenu(visible);
  }, [visible]);

  const useOutsideElement = (refOutSide) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (refOutSide.current && !refOutSide.current.contains(event.target)) {
          (onClickOutside && visible) ? onClickOutside?.(setVisible) : setVisible({ show: false, top: 0, left: 0 });
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [refOutSide, onClickOutside, visible]);
  };
  useOutsideElement(wrapperRef);
  const onShow = () => {
    if (visible.show) {
      setVisible({ show: false, top: 0, left: 0 });
    } else {
      const positionMenu = getPosition ? getPosition?.(wrapperRef) : position;
      const top = overflowToggleRef?.current?.getBoundingClientRect().top;
      const left = overflowToggleRef?.current?.getBoundingClientRect().left;
      const heightMenu = menuRef?.current?.offsetHeight;
      const widthMenu = menuRef?.current?.offsetWidth;
      const heightToggle = overflowToggleRef?.current?.offsetHeight;
      const widthToggle = overflowToggleRef?.current?.offsetWidth;
      let menuPosition = { show: true, top: 0, left: 0 };
      if (positionMenu === 'bottom-left') {
        menuPosition = { show: true, top: top + heightToggle, left: left };
      } else if (positionMenu === 'bottom-right') {
        menuPosition = { show: true, top: top + heightToggle, left: left - widthMenu + widthToggle };
      } else if (positionMenu === 'top-left') {
        menuPosition = { show: true, top: top - heightMenu, left: left };
      } else if (positionMenu === 'top-right') {
        menuPosition = { show: true, top: top - heightMenu, left: left - widthMenu + widthToggle };
      }
      setVisible(menuPosition);
    }
    onToggleMenu?.();
  };

  return (
    <div ref={wrapperRef} className={`${styles['fn-overflow-menu']} ${classNames}`}>
      <div
        ref={overflowToggleRef}
        className={`${styles['menu-overflow-toggle']} ${visible.show && 'active-box-overflow-menu'}`}
        onClick={onShow}>
        {renderToggle || 'click here'}
      </div>
      <div ref={menuRef} className={`menu-overflow-dropdown `} style={{ position: 'fixed', top: visible?.top, left: visible?.left, visibility: visible?.show ? 'visible' : 'hidden' }}>
        {renderChildren?.(setVisible) || children}
      </div>
    </div>
  );
}
);

export default OverflowMenu;
