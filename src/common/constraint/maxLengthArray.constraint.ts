import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'MaxLengthArray', async: false })
export class MaxLengthArrayConstraint implements ValidatorConstraintInterface {

  validate(value: any, args: ValidationArguments) {
    const maxLength = args.constraints[0];
    if (!Array.isArray(value)) {
      return false;
    }
    for (const item of value) {
      if (typeof item !== 'string' || item.length > maxLength) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const maxLength = args.constraints[0];
    return `Each item in the array must be a string and have a maximum length of ${maxLength} characters`;
  }
}