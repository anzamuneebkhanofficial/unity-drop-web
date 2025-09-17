/** @format */

const handleExport = async () => {
  try {
    const filters = {};
    if (bloodGroup) filters.bloodGroup = bloodGroup;
    if (location) filters.location = location;

    // Add format param
    const params = { ...filters, format: exportFormat };

    // Use axios (apiWrapper) to get blob
    const res = await apiWrapper.get('/admin/export-donors', {
      params,
      responseType: 'blob', // important for files
      headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
    });

    // Create download link
    const blob = new Blob([res.data], {
      type:
        exportFormat === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFormat === 'excel' ? 'donors.xlsx' : 'donors.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error(err);
    alert('Export failed!');
  }
};

export default handleExport;
