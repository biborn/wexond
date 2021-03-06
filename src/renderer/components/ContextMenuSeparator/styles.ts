import styled from 'styled-components';
import { transparency } from '~/renderer/defaults';

export interface SeparatorProps {
  visible: boolean;
}

export const StyledSeparator = styled.div`
  margin-top: 4px;
  margin-bottom: 4px;
  background-color: rgba(0, 0, 0, ${transparency.light.dividers});
  height: 1px;
  width: 100%;
  transition: 0.2s opacity;

  display: ${({ visible }: { visible: boolean }) =>
    visible ? 'block' : 'none'};
`;
