import * as AJV from 'ajv';

export interface ValidatorSchema {
	$schema: string;
	$ref?: string;
	definitions: {
		[key: string]: {
			type: string;
			properties?: any;
		} | {
			$ref: string;
		} | any;
	};
	errors?: AJV.ErrorObject;
}

export class ValidatorSchemaConstruct<T = any> {
	schema: ValidatorSchema;

	constructor(data: any);

	validate(data: any): ValidatorSchemaResult<T>;
	toJSON(): T;
}

export type ValidatorSchemaImplementation<T = any> = new (data: any) => ValidatorSchemaConstruct<T>;

export interface ValidatorSchemaResult<T = any> {
	errors: AJV.ErrorObject[];
	result: T;
}
