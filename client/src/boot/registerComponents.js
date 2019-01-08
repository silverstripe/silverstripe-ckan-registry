import Injector from 'lib/Injector';
import CKANResourceLocatorField from 'components/CKANResourceLocatorField';
import CKANPresentedOptions from 'components/CKANPresentedOptions';
import CKANResultConditionsField from 'components/CKANResultConditionsField';

export default () => {
  Injector.component.registerMany({
    CKANResourceLocatorField,
    CKANPresentedOptions,
    CKANResultConditionsField,
  });
};
