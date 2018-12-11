import Injector from 'lib/Injector';
import CKANResourceLocator from 'components/CKANResourceLocator';

export default () => {
  Injector.component.registerMany({
    CKANResourceLocator,
  });
};
