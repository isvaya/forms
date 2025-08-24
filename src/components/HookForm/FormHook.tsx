import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { formSchema } from '../../validation/formYup';
import type { FormValues } from '../../validation/formYup';
import { useFormStore } from '../../store/useFormStore';
import PasswordStrength from '../../utils/passwordStrength';
import Autocomplete from '../Country/AutocompleteCountry';
import { Controller } from 'react-hook-form';

type Props = {
  onClose: () => void;
};

export default function HookForm({ onClose }: Props) {
  const addSubmission = useFormStore((s) => s.addSubmission);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
  });

  const password = useWatch({ control, name: 'password' });

  const onSubmit = (values: FormValues) => {
    const file = values.image?.[0];

    const saveData = (base64?: string) => {
      const data = {
        name: values.name,
        age: values.age,
        email: values.email,
        password: values.password,
        gender: values.gender,
        terms: values.terms,
        country: values.country,
        image: base64,
      };
      addSubmission(data);
      onClose();
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => saveData(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      saveData();
    }
  };

  const countries = useFormStore((s) => s.countries);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input id="name" {...register('name')} />
        </div>
        {errors.name && <p className="error">{errors.name.message || ''}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="age">Age:</label>
          <input id="age" type="number" {...register('age')} />
        </div>
        {errors.age && <p className="error">{errors.age.message || ''}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" {...register('email')} />
        </div>
        {errors.email && <p className="error">{errors.email.message || ''}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" {...register('password')} />
        </div>
        {errors.password && (
          <p className="error">{errors.password.message || ''}</p>
        )}
        <PasswordStrength password={password || ''} />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="confirmPassword">Repeat password:</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword.message || ''}</p>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" {...register('gender')}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        {errors.gender && (
          <p className="error">{errors.gender.message || ''}</p>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="terms">Accept Terms:</label>
          <input id="terms" type="checkbox" {...register('terms')} />
        </div>
        {errors.terms && <p className="error">{errors.terms.message || ''}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="image">Upload image:</label>
          <input
            id="image"
            type="file"
            accept="image/png,image/jpeg"
            {...register('image')}
          />
        </div>
        {errors.image && (
          <p className="error">{(errors.image.message as string) || ''}</p>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="country">Country:</label>
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Autocomplete
                value={field.value}
                onChange={field.onChange}
                options={countries}
              />
            )}
          />
        </div>
        {errors.country && (
          <p className="error">{errors.country.message || ''}</p>
        )}
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
