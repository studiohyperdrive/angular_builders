import * as AJV from 'ajv';
import { <%= type %> } from '<%= typePath %>';

export class <%= type %>Schema {
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
  } =<%= schema %>;

  private ajv: any;
  private data: <%= type %>;

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

  public toJSON(): <%= type %> {
    if (!this.data || !this.validate(this.data)) {
      return null;
    }

    return <%= jsonData %>;
  }
}
