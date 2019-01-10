import Injector from 'lib/Injector';
import CKANResourceLocatorField from 'components/CKANResourceLocatorField';
import CKANPresentedOptionsField from 'components/CKANPresentedOptionsField';
import CKANResultConditionsField from 'components/CKANResultConditionsField';

export default () => {
  Injector.component.registerMany({
    CKANResourceLocatorField,
    CKANPresentedOptionsField,
    CKANResultConditionsField,
  });
};
