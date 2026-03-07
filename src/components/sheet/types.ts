import { Observable } from 'rxjs';

export type DrawerActionVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export interface DrawerAction {
  label: string;
  onClick: () => void;
  variant?: DrawerActionVariant;
  disabled?: Observable<boolean>;
}

export interface DrawerObject {
  title: string;
  description: string;
  component?: {
    outlet: any;
    props: any;
  };
  position?: 'left' | 'right' | 'top' | 'bottom';
  width?: string;
  closeOnEscape?: boolean;
  dismissable?: boolean;
  onHide?: () => void;
  actions?: DrawerAction[];
}
