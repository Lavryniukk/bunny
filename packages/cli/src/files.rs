pub const INDEX_CONTENT: &str = r#"
import { Bunny } from "@bunny-ts/core"
import { Core } from "./core"

const bunny = new Bunny(Core)
bunny.listen(3000)
"#;

pub const CORE_CONTENT: &str = r#"
import {CoreModule} from "@bunny-ts/core"

@CoreModule()
export class Core {
    modules: []
}
"#;
