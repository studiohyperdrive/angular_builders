import * as AJV from 'ajv';
import { {{ TYPE }} } from '{{ TYPE_PATH }}';

export class {{ TYPE }}Schema {
	public schema: {
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
  } ={{ SCHEMA }};

  private ajv: any;
  private data: {{ TYPE }};

	constructor(data: any) {
    this.data = data;
		this.ajv = new AJV();
	}

	public validate(data: any): AJV.ErrorObject | boolean {
		const validated = this.ajv.validate(this.schema, data);

		if (!validated) {
			return this.schema.errors;
		}

		return validated;
  }

  public toJSON(): {{ TYPE }} {
    if (!this.data || !this.validate(this.data)) {
      return null;
    }

    return {{ JSON }};
  }
}
