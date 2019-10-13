# pio

Manage a small JSON database with a small scripting language.

## Get started

### Open Pio Online Editor

You can find it here: [https://allnulled.github.io/pio](https://allnulled.github.io/pio)

### Test the syntax

Every command is made with the following syntax:

```
{operation}{store}[:{item}]?[/{property}:{value}]*
```

The available operations are:

- `+`: adds an item to the store.
- `-`: removes an items from the store.
- `!`: edits an items from the store.
- `?`: selects an item [or some of them] from the store.
- `:`: execute some command from the store.

To create a store, simply add a new item in it.

To run the commands, you can click the 'play' button of the editor, or hit [CONTROL] + [ENTER] in your keyboard.


## Examples

Here we have some examples of this scripting language.

#### Example 1. Query all the stores:

```
?*
```

#### Example 2. Create a new store:

We need to insert one item in the store to do this.

#### Example 3. Insert a new item in a store:

```
+mystore:myitem
```

#### Example 4. Query one store:

```
?mystore
```

#### Example 5. Remove one item from the store:

```
-mystore:myitem
```

#### Example 6. Edit an item from the store (the item must exist):

```
!mystore:myitem/property:value
```

#### Example 7. Query a store grouping by some property:

```
+mystore:item1/date:2019-05-08
+mystore:item2/date:2019-05-07
+mystore:item3/date:2019-05-06
?mystore/:group:date
```

Note that currently the items are sorted automatically, from less to more.

#### Example 8. Create a new command:

```
+commands:hi/script:alert("HI USER!")
```

#### Example 9. Execute command:

```
:hi
```

#### Example 10. Using shortcuts and dateformatting in attributes:

```
+tarea:veterinario/fecha:$martes 18 00
+tarea:itv/fecha:$lunes 15 00
+tarea:clases de flamenco/fecha:$miercoles 18 00
?tarea
```

As you can see, it converted '$martes', '$miercoles' and '$lunes' into dates.

In a near future, these properties will be customizable.

Parallelly, the result of the attribute is different from what it is set.

This is because the passed parameter fit the dateformat regular expression:

`/^([0-9][0-9][0-9][0-9]) ([0-9][0-9]?) ([0-9][0-9]?) ([0-9][0-9]?) ([0-9][0-9]?)$/`

Which stands for:

`YYYY MM? DD? HH? mm?`

Basically, this format is for the user to do it easierly from mobile devices, as the whole language.







