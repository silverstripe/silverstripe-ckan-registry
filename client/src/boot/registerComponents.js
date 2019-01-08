import Injector from 'lib/Injector';
import CKANResourceLocatorField from 'components/CKANResourceLocatorField';
import CKANResultConditionsField from 'components/CKANResultConditionsField';

export default () => {
  Injector.component.registerMany({
    CKANResourceLocatorField,
    CKANResultConditionsField,
  });
};
