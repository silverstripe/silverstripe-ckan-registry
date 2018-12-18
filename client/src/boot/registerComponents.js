import Injector from 'lib/Injector';
import CKANResourceLocatorField from 'components/CKANResourceLocatorField';
import PresentedOptions from 'components/PresentedOptions';
import CKANResultConditionsField from 'components/CKANResultConditionsField';

export default () => {
  Injector.component.registerMany({
    CKANResourceLocatorField,
    PresentedOptions,
    CKANResultConditionsField,
  });
};
