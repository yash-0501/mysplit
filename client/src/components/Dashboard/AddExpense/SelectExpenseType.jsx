import { List, ListItem, ListItemText } from "@mui/material";

const SelectExpenseType = () => {

    const allExpenseTypes = ['EQUAL','UNEQAL','PERCENTAGE','SHARE'];

    return (
        <>
            <List>
                {allExpenseTypes.map((expenseType, index)=>(
                    <ListItem key={index}>
                        <ListItemText primary={expenseType} />
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default SelectExpenseType;