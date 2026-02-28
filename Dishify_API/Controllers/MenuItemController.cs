using Dishify_API.Data;
using Dishify_API.Models;
using Dishify_API.Models.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Dishify_API.Controllers
{
    [Route("api/MenuItem")]
    [ApiController]
    public class MenuItemController : Controller
    {

        private readonly ApplicationDbContext _db;
        private readonly ApiResponse _response;
        private readonly IWebHostEnvironment _env;

        public MenuItemController( ApplicationDbContext db, ApiResponse response, IWebHostEnvironment env) { 
            _db = db;
            _response = response;
            _env = env;

        }

        [HttpGet]
        public IActionResult GetMenuItems()
        {
            List<MenuItem> menuItems = _db.MenuItems.ToList();
            List<OrderDetail> orderDetailsWithRating = _db.OrderDetails.Where(u => u.Rating != null).ToList();

            foreach (var menuItem in menuItems)
            {
                var rating = orderDetailsWithRating.Where(u => u.MenuItemId == menuItem.Id).Select(u => u.Rating.Value);
              
                 double avgRating = rating.Any() ? rating.Average() : 0;
                menuItem.Rating = avgRating;
                
            }

            _response.Result = menuItems;
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }

        [HttpGet("{id:int}", Name ="GetMenuItem")]
        public IActionResult GetMenuItem(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.isSuccess = false;
                return BadRequest(_response);
            }

            MenuItem? menuItem = _db.MenuItems.FirstOrDefault(e => e.Id == id);
            if (menuItem == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                _response.isSuccess = false;
                return NotFound(_response);
            }

            var orderDetailsWithRating = _db.OrderDetails
                .Where(u => u.Rating != null && u.MenuItemId == menuItem.Id)
                .ToList();
            var ratings = orderDetailsWithRating.Select(u => u.Rating!.Value);
            menuItem.Rating = ratings.Any() ? ratings.Average() : 0;

            _response.Result = menuItem;
            _response.StatusCode = HttpStatusCode.OK;
            return Ok(_response);
        }


        [HttpPost]
        public async Task<ActionResult<ApiResponse>>
        CreateMenuItem([FromForm] MenuItemCreateDTO menuItemCreateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (menuItemCreateDTO.File == null || menuItemCreateDTO.File.Length == 0)
                    {
                        _response.isSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.ErrorMessages.Add("File is required");
                        return BadRequest(_response);

                    }

                    var imagesPath = Path.Combine(_env.WebRootPath, "images");
                    if (!Directory.Exists(imagesPath))
                    {
                        Directory.CreateDirectory(imagesPath);
                    }

                    var filePath = Path.Combine(imagesPath, menuItemCreateDTO.File.FileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath); 
                    }
                    // upload the image

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await menuItemCreateDTO.File.CopyToAsync(stream);
                    }
                    MenuItem menuItem = new MenuItem
                    {
                        Name = menuItemCreateDTO.Name,
                        Description = menuItemCreateDTO.Description,
                        Category = menuItemCreateDTO.Category,
                        SpecialTag = menuItemCreateDTO.SpecialTag,
                        Price = menuItemCreateDTO.Price,
                        Image = "images/"+menuItemCreateDTO.File.FileName
                    };

                    _db.MenuItems.Add(menuItem);
                    await _db.SaveChangesAsync();
                
                    _response.Result = menuItemCreateDTO;
                    _response.StatusCode = HttpStatusCode.Created;
                    return CreatedAtRoute("GetMenuItem", new { id = menuItem.Id }, _response);
                }
                else
                {
                    _response.isSuccess = false;
                
                }


            }
            catch (Exception e)
            {
                _response.isSuccess = false;
                _response.ErrorMessages = [e.ToString()];
            }
        return BadRequest(_response);
        }

        [HttpPut]
        public async Task<ActionResult<ApiResponse>>
      UpdateMenuItem(int id,[FromForm] MenuItemUpdateDTO menuItemUpdateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (menuItemUpdateDTO.Id != id)
                    {
                        _response.isSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        return BadRequest(_response);

                    }

                    MenuItem? menuItemFromDb = await _db.MenuItems.FirstOrDefaultAsync(e => e.Id == id);

                    if (menuItemFromDb == null)
                    {
                        _response.isSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        return BadRequest(_response);
                    }

                    menuItemFromDb.Name = menuItemUpdateDTO.Name;
                    menuItemFromDb.Description = menuItemUpdateDTO.Description;
                    menuItemFromDb.Price = menuItemUpdateDTO.Price;
                    menuItemFromDb.Category = menuItemUpdateDTO.Category;
                    menuItemFromDb.SpecialTag = menuItemUpdateDTO.SpecialTag;

                    if (menuItemUpdateDTO.File != null && menuItemUpdateDTO.File.Length > 0)
                    {
                        var imagesPath = Path.Combine(_env.WebRootPath, "images");
                        if (!Directory.Exists(imagesPath))
                        {
                            Directory.CreateDirectory(imagesPath);
                        }

                        var filePath = Path.Combine(imagesPath, menuItemUpdateDTO.File.FileName);

                        if (System.IO.File.Exists(filePath))
                        {
                            System.IO.File.Delete(filePath);
                        }
                        var filePath_OldFile = Path.Combine(_env.WebRootPath, menuItemFromDb.Image);

                        if (System.IO.File.Exists(filePath_OldFile))
                        {
                            System.IO.File.Delete(filePath_OldFile);
                        }

                        // upload the image

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await menuItemUpdateDTO.File.CopyToAsync(stream);
                        }
                        menuItemFromDb.Image = "images/" + menuItemUpdateDTO.File.FileName;

                    }



     
                    _db.MenuItems.Update(menuItemFromDb);
                    await _db.SaveChangesAsync();

                   
                    _response.StatusCode = HttpStatusCode.NoContent;
                    return Ok(_response);
                }
                else
                {
                    _response.isSuccess = false;

                }


            }
            catch (Exception e)
            {
                _response.isSuccess = false;
                _response.ErrorMessages = [e.ToString()];
            }
            return BadRequest(_response);
        }


        [HttpDelete]
        public async Task<ActionResult<ApiResponse>>DeleteMenuItem(int id)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (id == 0)
                    {
                        _response.isSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        return BadRequest(_response);

                    }

                    MenuItem? menuItemFromDb = await _db.MenuItems.FirstOrDefaultAsync(e => e.Id == id);

                    if (menuItemFromDb == null)
                    {
                        _response.isSuccess = false;
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        return BadRequest(_response);
                    }

                        var filePath_OldFile = Path.Combine(_env.WebRootPath, menuItemFromDb.Image);

                        if (System.IO.File.Exists(filePath_OldFile))
                        {
                            System.IO.File.Delete(filePath_OldFile);
                        }
              

                    _db.MenuItems.Remove(menuItemFromDb);
                    await _db.SaveChangesAsync();


                    _response.StatusCode = HttpStatusCode.NoContent;
                    return Ok(_response);
                }
                else
                {
                    _response.isSuccess = false;

                }


            }
            catch (Exception e)
            {
                _response.isSuccess = false;
                _response.ErrorMessages = [e.ToString()];
            }
            return BadRequest(_response);
        }

    }
}
