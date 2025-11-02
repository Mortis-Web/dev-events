const userDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>User {id} Details </div>;
};

export default userDetails;
