import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete.js';
autocomplete( $('#address'), $('#lat'), $('#lng') )
