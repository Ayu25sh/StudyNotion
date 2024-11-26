export const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("en-US",{
        month:'Long',
        day:'numeric',
        year:'numeric',
    })
}